import uuid
import hmac
import hashlib
from unittest.mock import patch
from django.conf import settings
from django.test import TestCase
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.agreements.models import (
    Agreement,
    AgreementPayment,
    AgreementOrder,
    AgreementPricingConfig,
    AgreementDocument,
    OrderEvent,
)
from apps.payments.models import Payment


class AgreementOrderAndDeliveryFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="TestPassword123!",
            first_name="Customer",
            last_name="User",
            role="OWNER",
        )
        self.staff_user = User.objects.create_user(
            email="admin@example.com",
            password="AdminPassword123!",
            first_name="Admin",
            last_name="Staff",
            role="ADMIN",
            is_staff=True,
        )
        self.partner_user = User.objects.create_user(
            email="partner@example.com",
            password="PartnerPassword123!",
            first_name="Legal",
            last_name="Advocate",
            role="PARTNER",
        )

        self.client.force_authenticate(self.user)
        self.agreement = Agreement.objects.create(
            created_by=self.user,
            owner_user=self.user,
            property_title="2BHK Flat",
            property_address="Shivalik Residency, Ahmedabad",
            property_city="Ahmedabad",
            property_state="Gujarat",
            property_pincode="380009",
            monthly_rent=15000,
            security_deposit=30000,
            duration_months=11,
            start_date="2026-10-01",
        )

    def test_01_pricing_config_active_and_api(self):
        """Pricing configuration returns configurable values without hardcoding"""
        config = AgreementPricingConfig.get_active()
        self.assertEqual(config.service_fee, 1499)
        self.assertEqual(config.hard_copy_fee, 50)
        self.assertEqual(config.expected_sla_days, 7)

        response = self.client.get("/api/v1/agreements/pricing-config/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data.get("success"))
        data = response.data.get("data")
        self.assertEqual(float(data["service_fee"]), 1499.0)
        self.assertEqual(float(data["hard_copy_fee"]), 50.0)

    def test_02_mandatory_document_upload(self):
        """Document uploads enforce status badges and valid document types"""
        pdf_file = SimpleUploadedFile("landlord_aadhaar.pdf", b"%PDF-1.4 dummy content", content_type="application/pdf")
        response = self.client.post(
            f"/api/v1/agreements/{self.agreement.id}/upload-document/",
            {"document_type": "LANDLORD_ID", "file": pdf_file},
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data.get("success"))
        doc = AgreementDocument.objects.filter(agreement=self.agreement, document_type="LANDLORD_ID").first()
        self.assertIsNotNone(doc)
        self.assertEqual(doc.status, AgreementDocument.DocumentStatus.UPLOADED)

        # Verify Document list endpoint returns Uploaded ✓
        list_res = self.client.get(f"/api/v1/agreements/{self.agreement.id}/documents/")
        self.assertEqual(list_res.status_code, 200)
        docs = list_res.data.get("data")
        self.assertEqual(len(docs), 1)
        self.assertEqual(docs[0]["document_type"], "LANDLORD_ID")
        self.assertEqual(docs[0]["status"], "UPLOADED")

    @patch("apps.payments.views.razorpay.Client")
    def test_03_payment_verification_and_idempotent_order_creation(self, gateway):
        """Payment verification idempotently creates a single order with ERK-2026-XXXXXX format"""
        key_secret = settings.RAZORPAY_KEY_SECRET
        order_id = "order_test_123456"
        payment_id = "pay_test_789012"
        gateway.return_value.payment.fetch.return_value = {"order_id": order_id, "status": "captured", "amount": 154900, "currency": "INR"}
        AgreementPayment.objects.create(agreement=self.agreement, payer=self.user, amount=1549, gateway_order_id=order_id, checkout_details={"delivery_type": "HARD_COPY", "service": "1499", "hard_copy": "50", "courier": "0", "printing": "0"})
        sig_payload = f"{order_id}|{payment_id}"
        valid_signature = hmac.new(
            key_secret.encode(),
            sig_payload.encode(),
            hashlib.sha256,
        ).hexdigest()

        verify_payload = {
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": valid_signature,
            "agreement_id": str(self.agreement.id),
            "delivery_type": "HARD_COPY",
            "recipient_name": "Rajesh Patel",
            "recipient_phone": "9825012345",
            "delivery_address": "Shivalik Residency, Ahmedabad",
            "delivery_city": "Ahmedabad",
            "delivery_state": "Gujarat",
            "delivery_pincode": "380009",
        }

        # First verification call
        res1 = self.client.post("/api/v1/payments/verify-payment/", verify_payload, format="json")
        self.assertEqual(res1.status_code, 200)
        self.assertTrue(res1.data.get("verified"))
        order_number1 = res1.data.get("order_number")
        self.assertTrue(order_number1.startswith("ERK-2026-"))

        # Second verification call with same payment_id (Simulated duplicate webhook)
        res2 = self.client.post("/api/v1/payments/verify-payment/", verify_payload, format="json")
        self.assertEqual(res2.status_code, 200)
        self.assertTrue(res2.data.get("verified"))
        order_number2 = res2.data.get("order_number")

        # Crucial idempotency assertion: exact same order number, total orders created = 1
        self.assertEqual(order_number1, order_number2)
        total_orders = AgreementOrder.objects.filter(payment_id=payment_id).count()
        self.assertEqual(total_orders, 1)

        order = AgreementOrder.objects.get(order_number=order_number1)
        self.assertEqual(order.delivery_type, AgreementOrder.DeliveryType.HARD_COPY)
        self.assertEqual(order.hard_copy_fee, 50)
        self.assertEqual(order.total_amount, 1549)

    def test_04_customer_view_hides_internal_complexity(self):
        """Customer dashboard hides partner names, QC internal notes, and partner fee"""
        order = AgreementOrder.objects.create(
            agreement=self.agreement,
            customer=self.user,
            delivery_type=AgreementOrder.DeliveryType.HARD_COPY,
            service_amount=1499,
            hard_copy_fee=50,
            total_amount=1549,
            payment_id="pay_internal_001",
            status=AgreementOrder.OrderStatus.STAMPING_IN_PROGRESS,
            assigned_partner=self.partner_user,
            partner_fee=400,
            internal_notes="Secret QC internal comments: advocate fee Rs 400",
        )

        customer_view = order.get_customer_view()
        # Assert customer friendly message
        self.assertEqual(customer_view["status_message"], "Your agreement is being processed.")
        # Assert internal fields are NOT present
        self.assertNotIn("assigned_partner", customer_view)
        self.assertNotIn("partner_fee", customer_view)
        self.assertNotIn("internal_notes", customer_view)

        # Assert customer API endpoint
        response = self.client.get(f"/api/v1/agreements/orders/{order.order_number}/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data.get("success"))
        api_data = response.data.get("data")
        self.assertEqual(api_data["order_number"], order.order_number)
        self.assertNotIn("partner_fee", api_data)
        self.assertNotIn("internal_notes", api_data)

    def test_05_admin_courier_management(self):
        """Admin can update courier provider, tracking number, and tracking status"""
        order = AgreementOrder.objects.create(
            agreement=self.agreement,
            customer=self.user,
            delivery_type=AgreementOrder.DeliveryType.HARD_COPY,
            service_amount=1499,
            hard_copy_fee=50,
            total_amount=1549,
            payment_id="pay_courier_001",
            status=AgreementOrder.OrderStatus.FINAL_DOCUMENT_READY,
        )

        self.client.force_authenticate(self.staff_user)
        order.final_document = "agreements/final_orders/test.pdf"
        order.qc_status = "PASSED"
        order.save()
        update_payload = {
            "courier_provider": "Blue Dart Express",
            "tracking_number": "BD99887766IN",
            "status": "COURIER_BOOKED",
            "expected_delivery_date": "2026-10-12",
        }
        res = self.client.patch(
            f"/api/v1/agreements/admin-orders/{order.id}/update-courier/",
            update_payload,
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data.get("success"))

        order.refresh_from_db()
        self.assertEqual(order.courier_provider, "Blue Dart Express")
        self.assertEqual(order.tracking_number, "BD99887766IN")
        self.assertEqual(order.status, AgreementOrder.OrderStatus.COURIER_BOOKED)
        self.assertEqual(str(order.expected_delivery_date), "2026-10-12")

        # Verify audit event was logged
        event = OrderEvent.objects.filter(order=order, action="COURIER_UPDATED").first()
        self.assertIsNotNone(event)
        self.assertIn("BD99887766IN", event.notes)
