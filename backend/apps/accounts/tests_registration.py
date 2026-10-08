from unittest.mock import patch
from django.contrib import admin
from django.test import TestCase
from rest_framework.test import APIClient
from apps.accounts.models import User, UserProfile
from apps.audit.models import AuditLog
from apps.organizations.models import Organization, OrganizationMember
from apps.agreements.models import AgreementPayment, AgreementOrder
from apps.billing.models import Invoice
from apps.payments.models import Payment


class RegistrationPersistenceTests(TestCase):
    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.client = APIClient()
        self.payload = dict(email="launch-registration@example.test", password="Registration-test42!", first_name="Test", last_name="Owner", phone="9876543201", role="OWNER", organization_name="Registration Test")

    def test_registration_persists_profile_organization_audit_and_usable_session(self):
        response = self.client.post("/api/v1/auth/register/", self.payload, format="json")
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email=self.payload["email"])
        self.assertTrue(user.check_password(self.payload["password"]))
        self.assertEqual(user.phone_number, self.payload["phone"])
        self.assertEqual(UserProfile.objects.get(user=user).full_name, "Test Owner")
        self.assertTrue(OrganizationMember.objects.filter(user=user, organization__name="Registration Test").exists())
        self.assertTrue(AuditLog.objects.filter(user=user, action="USER_REGISTER").exists())
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + response.data["data"]["tokens"]["access"])
        me = self.client.get("/api/v1/auth/me/")
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.data["data"]["email"], self.payload["email"])

    def test_audit_failure_rolls_back_entire_registration(self):
        with patch("apps.accounts.views.AuditLog.objects.create", side_effect=RuntimeError("audit unavailable")):
            response = self.client.post("/api/v1/auth/register/", self.payload, format="json")
            self.assertEqual(response.status_code, 500)
        self.assertFalse(User.objects.filter(email=self.payload["email"]).exists())
        self.assertFalse(UserProfile.objects.exists())
        self.assertFalse(Organization.objects.exists())

    def test_duplicate_email_and_phone_do_not_create_additional_users(self):
        self.assertEqual(self.client.post("/api/v1/auth/register/", self.payload, format="json").status_code, 201)
        self.assertEqual(self.client.post("/api/v1/auth/register/", {**self.payload, "email": self.payload["email"].upper()}, format="json").status_code, 400)
        self.assertEqual(self.client.post("/api/v1/auth/register/", {**self.payload, "email": "other@example.test"}, format="json").status_code, 400)
        self.assertEqual(User.objects.count(), 1)

    def test_customer_records_and_payments_are_registered_in_admin(self):
        for model in [User, AgreementPayment, AgreementOrder, Invoice, Payment]:
            self.assertIn(model, admin.site._registry)
