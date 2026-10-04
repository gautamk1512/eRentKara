import os
import uuid
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User
from apps.agreements.models import (
    Agreement,
    AgreementParty,
    UserIdentityVerification,
    Shop,
    ShopOperator,
    KioskSession,
)
from apps.agreements.providers.identity import (
    AadhaarSandboxProvider,
    MockIdentityProvider,
    AadhaarAuthorizedProvider,
    get_identity_provider,
)
from apps.agreements.services import AgreementService


class AadhaarSandboxAndSecurityTests(TestCase):
    """
    Comprehensive test suite verifying Aadhaar Sandbox and e-KYC integration,
    consent requirements, attempt rate limiting, security constraints,
    shop-assisted boundaries, and production safety guards.
    """

    def setUp(self):
        self.client = APIClient()

        # Users
        self.owner = User.objects.create_user(
            email="owner_test@example.com",
            password="Password123!",
            first_name="Ramesh",
            last_name="Bhai",
            role=User.RoleChoices.OWNER,
            phone_number="9825011111",
        )
        self.tenant = User.objects.create_user(
            email="tenant_test@example.com",
            password="Password123!",
            first_name="Suresh",
            last_name="Kumar",
            role=User.RoleChoices.TENANT,
            phone_number="9825022222",
        )
        self.shop_admin = User.objects.create_user(
            email="shop_owner@example.com",
            password="Password123!",
            first_name="Shop",
            last_name="Master",
            role=User.RoleChoices.SHOP_ADMIN,
        )
        self.shop_operator_user = User.objects.create_user(
            email="operator@example.com",
            password="Password123!",
            first_name="Operator",
            last_name="One",
            role=User.RoleChoices.SHOP_OPERATOR,
        )
        self.rogue_operator = User.objects.create_user(
            email="rogue@example.com",
            password="Password123!",
            first_name="Rogue",
            last_name="Actor",
            role=User.RoleChoices.SHOP_OPERATOR,
        )

        # Shop & Operator
        self.shop = Shop.objects.create(
            shop_code="TEST-SHOP-01",
            name="Ahmedabad E-Kiosk",
            owner_user=self.shop_admin,
            city="Ahmedabad",
            state="Gujarat",
            phone="9825033333",
            is_active=True,
        )
        self.operator = ShopOperator.objects.create(
            shop=self.shop,
            user=self.shop_operator_user,
            is_active=True,
        )

        # Base Agreement
        self.agreement = Agreement.objects.create(
            agreement_type=Agreement.AgreementType.RESIDENTIAL,
            property_title="Shivalik 2BHK",
            property_state="GJ",
            property_city="Ahmedabad",
            property_address="Flat 101, Shivalik Plaza, Satellite, Ahmedabad",
            monthly_rent=20000,
            security_deposit=40000,
            duration_months=11,
            start_date=timezone.now().date(),
            created_by=self.owner,
        )
        self.owner_party = AgreementParty.objects.create(
            agreement=self.agreement,
            user=self.owner,
            party_type=AgreementParty.PartyType.OWNER,
            full_name="Ramesh Patel",
            email="owner_test@example.com",
            phone="9825011111",
        )
        self.tenant_party = AgreementParty.objects.create(
            agreement=self.agreement,
            user=self.tenant,
            party_type=AgreementParty.PartyType.TENANT,
            full_name="Suresh Kumar",
            email="tenant_test@example.com",
            phone="9825022222",
        )

    # 1. Verification Started & OTP Sent
    def test_01_verification_started_and_otp_sent(self):
        provider = AadhaarSandboxProvider()
        res = provider.start_verification(
            aadhaar_number="999988887777",
            full_name="Ramesh Patel",
            phone="9825011111",
            consent_given=True,
        )
        self.assertTrue(res["success"])
        self.assertEqual(res["status"], "OTP_SENT")
        self.assertEqual(res["masked_aadhaar"], "XXXX-XXXX-7777")
        self.assertTrue(res["is_sandbox"])
        self.assertIn("SANDBOX / TEST MODE", res["sandbox_notice"])

    # 2. Mandatory Explicit Consent Check
    def test_02_mandatory_consent_rejection(self):
        provider = AadhaarSandboxProvider()
        res = provider.start_verification(
            aadhaar_number="999988887777",
            consent_given=False,
        )
        self.assertFalse(res["success"])
        self.assertEqual(res["error"], "EXPLICIT_CONSENT_REQUIRED")

    # 3. Invalid Aadhaar Format Rejection
    def test_03_invalid_aadhaar_format_rejected(self):
        provider = AadhaarSandboxProvider()
        res = provider.start_verification(
            aadhaar_number="12345",  # Less than 12 digits
            consent_given=True,
        )
        self.assertFalse(res["success"])
        self.assertEqual(res["error"], "INVALID_AADHAAR_FORMAT")

    # 4. Correct Test OTP Verification (123456)
    def test_04_correct_test_otp_verifies_identity(self):
        provider = AadhaarSandboxProvider()
        start_res = provider.start_verification(
            aadhaar_number="999988887777",
            full_name="Ramesh Patel",
            consent_given=True,
        )
        ref = start_res["verification_reference"]

        verify_res = provider.verify_otp(verification_reference=ref, otp_code="123456")
        self.assertTrue(verify_res["success"])
        self.assertTrue(verify_res["verified"])
        self.assertEqual(verify_res["kyc_data"]["verified_name"], "Ramesh Patel")
        self.assertEqual(verify_res["kyc_data"]["masked_aadhaar"], "XXXX-XXXX-7777")

    # 5. Incorrect Test OTP Rejection
    def test_05_incorrect_otp_rejected(self):
        provider = AadhaarSandboxProvider()
        start_res = provider.start_verification(
            aadhaar_number="999988887777",
            consent_given=True,
        )
        ref = start_res["verification_reference"]

        verify_res = provider.verify_otp(verification_reference=ref, otp_code="000000")
        self.assertFalse(verify_res["success"])
        self.assertFalse(verify_res["verified"])
        self.assertIn("Invalid OTP", verify_res["message"])

    # 6. Expired OTP Rejection
    def test_06_expired_otp_rejected(self):
        provider = AadhaarSandboxProvider()
        start_res = provider.start_verification(
            aadhaar_number="999988887777",
            consent_given=True,
        )
        ref = start_res["verification_reference"]

        # Artificially expire the session
        AadhaarSandboxProvider._sandbox_vault[ref]["expires_at"] = timezone.now() - timezone.timedelta(seconds=1)

        verify_res = provider.verify_otp(verification_reference=ref, otp_code="123456")
        self.assertFalse(verify_res["success"])
        self.assertIn("expired", verify_res["message"].lower())

    # 7. Too Many Attempts Lockout
    def test_07_too_many_attempts_locks_session(self):
        provider = AadhaarSandboxProvider()
        start_res = provider.start_verification(
            aadhaar_number="999988887777",
            consent_given=True,
        )
        ref = start_res["verification_reference"]

        for _ in range(6):
            provider.verify_otp(verification_reference=ref, otp_code="987654")

        # Session should now be locked
        locked_res = provider.verify_otp(verification_reference=ref, otp_code="123456")
        self.assertFalse(locked_res["success"])
        self.assertIn("locked", locked_res["message"].lower())

    # 8. Retry & Resend OTP Flow
    def test_08_resend_otp_flow(self):
        provider = AadhaarSandboxProvider()
        start_res = provider.start_verification(
            aadhaar_number="999988887777",
            consent_given=True,
        )
        ref = start_res["verification_reference"]

        resend_res = provider.send_otp(ref)
        self.assertTrue(resend_res["success"])
        self.assertEqual(resend_res["status"], "OTP_SENT")

    # 9. Standalone REST API Endpoint Start and Verify
    def test_09_standalone_api_flow(self):
        start_res = self.client.post(
            "/api/v1/verification/aadhaar/start/",
            {
                "aadhaar_number": "999988885555",
                "consent_given": True,
                "full_name": "API Citizen",
                "phone": "9825099999",
            },
            format="json",
        )
        self.assertEqual(start_res.status_code, status.HTTP_200_OK)
        ref = start_res.data["verification_reference"]

        # Verify status endpoint
        status_res = self.client.get(f"/api/v1/verification/status/{ref}/")
        self.assertEqual(status_res.status_code, status.HTTP_200_OK)
        self.assertEqual(status_res.data["status"], "OTP_SENT")
        self.assertFalse(status_res.data["identity_verified"])

        # Verify OTP
        otp_res = self.client.post(
            "/api/v1/verification/aadhaar/verify-otp/",
            {"verification_reference": ref, "otp_code": "123456"},
            format="json",
        )
        self.assertEqual(otp_res.status_code, status.HTTP_200_OK)
        self.assertTrue(otp_res.data["verified"])

        # Verify record in database
        record = UserIdentityVerification.objects.get(provider_reference=ref)
        self.assertEqual(record.status, UserIdentityVerification.Status.VERIFIED)
        self.assertTrue(record.identity_verified)
        self.assertEqual(record.masked_aadhaar, "XXXX-XXXX-5555")

    # 10. Owner Verification via Agreement Service
    def test_10_owner_verification_flow(self):
        res = AgreementService.verify_party_identity(self.owner_party, "999988881111", "123456")
        self.assertTrue(res["success"])
        self.owner_party.refresh_from_db()
        self.assertEqual(self.owner_party.verification_status, AgreementParty.VerificationStatus.VERIFIED)
        self.assertEqual(self.owner_party.aadhaar_masked, "XXXX-XXXX-1111")

    # 11. Tenant Verification via Agreement Service
    def test_11_tenant_verification_flow(self):
        res = AgreementService.verify_party_identity(self.tenant_party, "999988882222", "123456")
        self.assertTrue(res["success"])
        self.tenant_party.refresh_from_db()
        self.assertEqual(self.tenant_party.verification_status, AgreementParty.VerificationStatus.VERIFIED)
        self.assertEqual(self.tenant_party.aadhaar_masked, "XXXX-XXXX-2222")

    # 12. Shop-Assisted Verification (Authorized Operator)
    def test_12_authorized_shop_assisted_verification(self):
        session = KioskSession.objects.create(
            shop=self.shop,
            operator=self.shop_operator_user,
            owner_user=self.owner,
            tenant_user=self.tenant,
        )
        self.assertTrue(self.operator.is_active)

        # Authorized assisted identity flow succeeds
        res = AgreementService.verify_party_identity(self.tenant_party, "999988882222", "123456")
        self.assertTrue(res["success"])

    # 13. Unauthorized Shop Operator Boundary (MUST BE REJECTED)
    def test_13_unauthorized_shop_attempting_to_sign_for_customer_rejected(self):
        # Rogue operator not assigned to this shop or inactive
        unauth_operator = ShopOperator.objects.create(
            shop=self.shop,
            user=self.rogue_operator,
            is_active=False,  # Inactive operator
        )

        # Attempting action with unauthenticated or unauthorized actor
        self.client.force_authenticate(user=self.rogue_operator)
        res = self.client.post(
            f"/api/v1/rent-agreements/{self.agreement.id}/sign/",
            {"party_type": "OWNER", "signature_evidence": "Forged Kiosk Signature"},
            format="json",
        )
        # Must be rejected because rogue operator is not authorized for this agreement
        self.assertIn(res.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

    # 14. Production Safety Checks
    def test_14_production_safety_rejects_mock_and_sandbox(self):
        # Set APP_ENV=production and verify get_identity_provider blocks sandbox
        old_app_env = os.environ.get("APP_ENV", "")
        old_aadhaar_env = os.environ.get("AADHAAR_ENV", "")
        try:
            os.environ["APP_ENV"] = "production"
            os.environ["AADHAAR_ENV"] = "sandbox"
            os.environ["USE_MOCK_PROVIDERS"] = "false"

            with self.assertRaises(PermissionError) as ctx:
                get_identity_provider()
            self.assertIn("CRITICAL PRODUCTION SAFETY RULE VIOLATION", str(ctx.exception))

            os.environ["AADHAAR_ENV"] = "production"
            os.environ["USE_MOCK_PROVIDERS"] = "true"
            with self.assertRaises(PermissionError) as ctx:
                get_identity_provider()
            self.assertIn("CRITICAL PRODUCTION SAFETY RULE VIOLATION", str(ctx.exception))

        finally:
            os.environ["APP_ENV"] = old_app_env
            os.environ["AADHAAR_ENV"] = old_aadhaar_env
            os.environ["USE_MOCK_PROVIDERS"] = "true"
