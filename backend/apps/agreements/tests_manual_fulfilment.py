import hashlib
import hmac
import tempfile
from decimal import Decimal
from unittest.mock import patch
from django.conf import settings
from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from apps.accounts.models import User, UserProfile
from .models import Agreement, AgreementDocument, AgreementOrder, AgreementPayment


class ManualFulfilmentTests(TestCase):
    def setUp(self):
        self.media = tempfile.TemporaryDirectory()
        self.override = override_settings(MEDIA_ROOT=self.media.name)
        self.override.enable()
        self.addCleanup(self.media.cleanup)
        self.addCleanup(self.override.disable)
        self.client = APIClient()
        self.customer = User.objects.create_user(email="customer@flow.test", password="test-password", role="OWNER")
        self.other = User.objects.create_user(email="other@flow.test", password="test-password")
        self.admin = User.objects.create_user(email="admin@flow.test", password="test-password", is_staff=True)
        self.partner = User.objects.create_user(email="partner@flow.test", password="test-password", role="LEGAL_PARTNER")
        UserProfile.objects.create(user=self.partner, preferred_city="Ahmedabad")
        self.agreement = Agreement.objects.create(created_by=self.customer, owner_user=self.customer, property_title="Flat", property_address="Test Road", property_city="Ahmedabad", property_state="Gujarat", monthly_rent=15000, security_deposit=30000, duration_months=11, start_date="2026-10-01")
        self.order = AgreementOrder.objects.create(agreement=self.agreement, customer=self.customer, payment_status="SUCCESS", status="DOCUMENT_REVIEW")

    def authenticate(self, user):
        self.client.force_authenticate(user)

    def upload_docs(self):
        self.authenticate(self.customer)
        for kind in ["LANDLORD_ID", "TENANT_ID", "PROPERTY_DOC"]:
            response = self.client.post(f"/api/v1/agreements/{self.agreement.pk}/upload-document/", {"document_type": kind, "file": SimpleUploadedFile("proof.pdf", b"%PDF-1.4 test", content_type="application/pdf")})
            self.assertEqual(response.status_code, 201)

    def verify_docs(self):
        self.authenticate(self.admin)
        for doc in self.order.documents.all():
            response = self.client.patch(f"/api/v1/agreements/admin-orders/{self.order.pk}/verify-document/", {"document_id": str(doc.pk), "status": "VERIFIED"}, format="json")
            self.assertEqual(response.status_code, 200)

    def test_anonymous_and_other_customer_cannot_read_documents_orders_or_admin(self):
        for url in ["/api/v1/agreements/orders/", f"/api/v1/agreements/orders/{self.order.order_number}/", f"/api/v1/agreements/{self.agreement.pk}/documents/", "/api/v1/agreements/admin-orders/"]:
            self.assertIn(self.client.get(url).status_code, [401, 403])
        self.authenticate(self.other)
        self.assertEqual(self.client.get(f"/api/v1/agreements/orders/{self.order.order_number}/").status_code, 404)
        self.assertEqual(self.client.get(f"/api/v1/agreements/{self.agreement.pk}/documents/").status_code, 403)
        self.assertEqual(self.client.get("/api/v1/agreements/admin-orders/").status_code, 403)

    def test_verification_city_assignment_partner_submission_and_approval(self):
        self.upload_docs()
        self.authenticate(self.admin)
        url = f"/api/v1/agreements/admin-orders/{self.order.pk}/assign-partner/"
        self.assertEqual(self.client.patch(url, {"partner_id": str(self.partner.pk)}).status_code, 400)
        self.verify_docs()
        self.partner.profile.preferred_city = "Surat"
        self.partner.profile.save()
        self.assertEqual(self.client.patch(url, {"partner_id": str(self.partner.pk)}).status_code, 400)
        self.partner.profile.preferred_city = "Ahmedabad"
        self.partner.profile.save()
        self.assertEqual(self.client.patch(url, {"partner_id": str(self.partner.pk)}).status_code, 200)
        self.authenticate(self.partner)
        result = self.client.get("/api/v1/agreements/partner-orders/")
        self.assertEqual(len(result.data["data"]), 1)
        self.assertEqual(self.client.patch(f"/api/v1/agreements/partner-orders/{self.order.pk}/progress/", {"status": "COMPLETED"}).status_code, 400)
        self.assertEqual(self.client.patch(f"/api/v1/agreements/partner-orders/{self.order.pk}/progress/", {"status": "AGREEMENT_PROCESSING"}).status_code, 200)
        final_bytes = b"%PDF-1.4 completed agreement"
        result = self.client.post(f"/api/v1/agreements/partner-orders/{self.order.pk}/upload-final-doc/", {"file": SimpleUploadedFile("final.pdf", final_bytes, content_type="application/pdf")})
        self.assertEqual(result.status_code, 200)
        self.order.refresh_from_db()
        with self.order.final_document.open("rb") as file:
            self.assertEqual(file.read(), final_bytes)
        self.assertEqual(self.order.final_document_hash, hashlib.sha256(final_bytes).hexdigest())
        self.authenticate(self.customer)
        download = f"/api/v1/agreements/orders/{self.order.pk}/download/"
        self.assertEqual(self.client.get(download).status_code, 400)
        self.authenticate(self.admin)
        self.assertEqual(self.client.patch(f"/api/v1/agreements/admin-orders/{self.order.pk}/qc/", {"qc_status": "PASSED"}).status_code, 200)
        self.authenticate(self.customer)
        response = self.client.get(download)
        self.assertEqual(response.status_code, 200)
        response.close()
        self.authenticate(self.other)
        self.assertEqual(self.client.get(download).status_code, 403)

    def test_document_rejection_reupload_resets_verification(self):
        self.upload_docs()
        self.authenticate(self.admin)
        doc = self.order.documents.first()
        url = f"/api/v1/agreements/admin-orders/{self.order.pk}/verify-document/"
        self.assertEqual(self.client.patch(url, {"document_id": str(doc.pk), "status": "INVALID"}).status_code, 400)
        self.assertEqual(self.client.patch(url, {"document_id": str(doc.pk), "status": "INVALID", "notes": "Unreadable ID"}).status_code, 200)
        self.upload_docs()
        doc.refresh_from_db()
        self.assertEqual(doc.status, "UPLOADED")
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, "DOCUMENT_REVIEW")

    def test_unassigned_partner_cannot_read_or_download(self):
        self.upload_docs()
        self.authenticate(self.partner)
        self.assertEqual(self.client.get(f"/api/v1/agreements/partner-orders/{self.order.pk}/").status_code, 404)
        doc = self.order.documents.first()
        self.assertEqual(self.client.get(f"/api/v1/agreements/document-downloads/{doc.pk}/").status_code, 403)

    def test_unknown_document_type_and_missing_final_approval_rejected(self):
        self.authenticate(self.customer)
        response = self.client.post(f"/api/v1/agreements/{self.agreement.pk}/upload-document/", {"document_type": "UNKNOWN", "file": SimpleUploadedFile("proof.pdf", b"%PDF-1.4")})
        self.assertEqual(response.status_code, 400)
        self.authenticate(self.admin)
        self.assertEqual(self.client.patch(f"/api/v1/agreements/admin-orders/{self.order.pk}/qc/", {"qc_status": "PASSED"}).status_code, 400)

    @patch("apps.payments.views.razorpay.Client")
    def test_backend_price_checkout_binding_and_duplicate_verification(self, gateway):
        self.order.delete()
        self.upload_docs()
        gateway.return_value.payment.fetch.return_value = {"order_id": "order_bound", "status": "captured", "amount": 149900, "currency": "INR"}
        gateway.return_value.order.create.return_value = {"id": "order_bound", "amount": 149900, "currency": "INR"}
        response = self.client.post("/api/v1/payments/create-order/", {"agreement_id": str(self.agreement.pk), "delivery_type": "SOFT_COPY", "amount": 100}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(gateway.return_value.order.create.call_args.kwargs["data"]["amount"], 149900)
        signature = hmac.new(settings.RAZORPAY_KEY_SECRET.encode(), b"order_bound|pay_bound", hashlib.sha256).hexdigest()
        payload = {"agreement_id": str(self.agreement.pk), "razorpay_order_id": "order_bound", "razorpay_payment_id": "pay_bound", "razorpay_signature": signature, "delivery_type": "HARD_COPY"}
        self.authenticate(self.other)
        self.assertEqual(self.client.post("/api/v1/payments/verify-payment/", payload, format="json").status_code, 403)
        self.authenticate(self.customer)
        first = self.client.post("/api/v1/payments/verify-payment/", payload, format="json")
        self.assertEqual(first.status_code, 200)
        second = self.client.post("/api/v1/payments/verify-payment/", payload, format="json")
        self.assertEqual(second.status_code, 200)
        self.assertEqual(first.data["order_number"], second.data["order_number"])
        order = AgreementOrder.objects.get(payment_id="pay_bound")
        self.assertEqual(order.delivery_type, "SOFT_COPY")
        self.assertEqual(order.total_amount, Decimal("1499"))
        self.assertEqual(order.status, "DOCUMENT_REVIEW")
        self.assertEqual(AgreementPayment.objects.filter(gateway_order_id="order_bound").count(), 1)

    def test_partner_role_cannot_be_self_registered(self):
        response = self.client.post("/api/v1/auth/register/", {"email": "fake@flow.test", "password": "test-password", "role": "LEGAL_PARTNER"})
        self.assertEqual(response.status_code, 400)
