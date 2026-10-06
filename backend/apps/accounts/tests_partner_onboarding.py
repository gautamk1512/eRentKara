from unittest.mock import patch
from django.test import TestCase, override_settings
from django.core import mail
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User, PartnerApplication, ContactRequest
from .partner_onboarding import approve_partner, send_partner_invitation


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend", FRONTEND_URL="http://localhost:3000")
class PartnerOnboardingTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.admin = User.objects.create_superuser(email="admin@example.test", password="Admin-test-long42")
        self.payload = dict(full_name="Test Advocate", email="partner@example.test", phone="9876543210", business_name="Test Practice", city="Vadodara", state="Gujarat", profession="ADVOCATE", registration_number="TEST-123", address="Test office address", consent=True)

    def application(self):
        return PartnerApplication.objects.create(**self.payload)

    def test_application_stored_without_granting_access(self):
        response = self.client.post(reverse("partner-apply"), {**self.payload, "status": "APPROVED", "role": "LEGAL_PARTNER"}, format="json")
        self.assertEqual(response.status_code, 201)
        app = PartnerApplication.objects.get()
        self.assertEqual(app.status, "PENDING")
        self.assertIsNone(app.user)
        self.assertFalse(User.objects.filter(email=self.payload["email"]).exists())

    def test_consent_and_duplicate_email_validation(self):
        response = self.client.post(reverse("partner-apply"), {**self.payload, "consent": False}, format="json")
        self.assertEqual(response.status_code, 400)
        self.application()
        response = self.client.post(reverse("partner-apply"), {**self.payload, "email": self.payload["email"].upper()}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_approval_email_activation_and_partner_id_login(self):
        app = self.application()
        self.assertTrue(approve_partner(app.pk, self.admin))
        app.refresh_from_db()
        self.assertFalse(app.user.is_active)
        self.assertEqual(app.user.profile.preferred_city, "Vadodara")
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(app.partner_id, mail.outbox[0].body)
        self.assertIn("/partner/activate?", mail.outbox[0].body)
        token = default_token_generator.make_token(app.user)
        payload = {"application": str(app.pk), "token": token, "password": "Partner-password-good42"}
        self.assertEqual(self.client.post(reverse("partner-activate"), payload, format="json").status_code, 200)
        self.assertEqual(self.client.post(reverse("partner-activate"), payload, format="json").status_code, 400)
        result = self.client.post(reverse("auth-login"), {"email": app.partner_id, "password": payload["password"]}, format="json")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.data["data"]["user"]["role"], "LEGAL_PARTNER")

    def test_pending_and_invalid_tokens_cannot_activate(self):
        app = self.application()
        result = self.client.post(reverse("partner-activate"), {"application": str(app.pk), "token": "bad", "password": "valid-long-password"}, format="json")
        self.assertEqual(result.status_code, 400)
        self.assertEqual(self.client.post(reverse("partner-activate"), {"application": "invalid"}, format="json").status_code, 400)

    def test_expired_invitation(self):
        app = self.application(); approve_partner(app.pk, self.admin); app.refresh_from_db()
        token = default_token_generator.make_token(app.user)
        with override_settings(PASSWORD_RESET_TIMEOUT=-1):
            response = self.client.post(reverse("partner-activate"), {"application": str(app.pk), "token": token, "password": "long-password-good42"}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_email_failure_is_visible_and_retryable(self):
        app = self.application()
        with patch("apps.accounts.partner_onboarding.send_mail", side_effect=RuntimeError("test delivery failure")):
            self.assertFalse(approve_partner(app.pk, self.admin))
        app.refresh_from_db()
        self.assertEqual(app.status, "APPROVED")
        self.assertTrue(app.invitation_error)
        self.assertFalse(app.user.is_active)
        self.assertTrue(send_partner_invitation(app))
        app.refresh_from_db(); self.assertEqual(app.invitation_error, "")

    def test_existing_user_cannot_be_promoted_by_application(self):
        app = self.application()
        user = User.objects.create_user(email=app.email, password="existing-long-42", role="TENANT")
        with self.assertRaises(ValidationError): approve_partner(app.pk, self.admin)
        user.refresh_from_db(); self.assertEqual(user.role, "TENANT")

    def test_contact_form_saved_with_product(self):
        response = self.client.post(reverse("contact-request"), dict(name="Test Customer", email="customer@example.test", product="rental", subject="Listing question", message="Please help with a property listing."), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactRequest.objects.get().product, "rental")

    def test_admin_dashboard_renders_and_requires_staff(self):
        self.assertEqual(self.client.get("/admin/").status_code, 302)
        self.client.force_login(self.admin)
        response = self.client.get("/admin/")
        self.assertContains(response, "A clear view of your operations.")
        self.assertContains(response, "Partner applications")
        self.assertContains(response, "operations-card")
