import uuid
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User
from apps.agreements.models import (
    Agreement,
    AgreementParty,
    AgreementVersion,
    AgreementInvitation,
    LegalRule,
    Shop,
    ShopOperator,
    KioskSession,
)
from apps.agreements.services import (
    AgreementService,
    AgreementStateMachine,
    LegalRuleEngine,
)


class AgreementWorkflowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Users
        self.owner = User.objects.create_user(
            email="owner@test.com",
            password="Password123!",
            first_name="Rajesh",
            last_name="Patel",
            role=User.RoleChoices.OWNER,
            phone_number="9825000001",
        )
        self.tenant = User.objects.create_user(
            email="tenant@test.com",
            password="Password123!",
            first_name="Amit",
            last_name="Shah",
            role=User.RoleChoices.TENANT,
            phone_number="9825000002",
        )
        self.other_tenant = User.objects.create_user(
            email="other@test.com",
            password="Password123!",
            first_name="Other",
            last_name="Person",
            role=User.RoleChoices.TENANT,
            phone_number="9825000003",
        )
        self.shop_admin = User.objects.create_user(
            email="shopadmin@test.com",
            password="Password123!",
            first_name="Kiosk",
            last_name="Owner",
            role=User.RoleChoices.SHOP_ADMIN,
        )
        self.shop_operator = User.objects.create_user(
            email="operator@test.com",
            password="Password123!",
            first_name="Kiosk",
            last_name="Operator",
            role=User.RoleChoices.SHOP_OPERATOR,
        )
        self.super_admin = User.objects.create_superuser(
            email="admin@test.com",
            password="Password123!",
            first_name="Super",
            last_name="Admin",
            role=User.RoleChoices.SUPER_ADMIN,
        )

        # Shop
        self.shop = Shop.objects.create(
            shop_code="GJ-AHM-TEST",
            name="Ahmedabad Test Kiosk",
            owner_user=self.shop_admin,
            phone="9825099999",
            email="kiosk@test.com",
            address="CG Road, Ahmedabad",
            city="Ahmedabad",
            district="Ahmedabad",
            state="Gujarat",
            is_approved=True,
            is_active=True,
        )
        ShopOperator.objects.create(shop=self.shop, user=self.shop_operator, is_active=True)

        # Gujarat Legal Rules
        self.rule_11m = LegalRule.objects.create(
            state_code="GJ",
            state_name="Gujarat",
            agreement_type=LegalRule.AgreementType.RESIDENTIAL,
            min_duration_months=1,
            max_duration_months=11,
            fixed_stamp_duty=300.0,
            rate_percentage=0.0,
            registration_fee_fixed=0.0,
            registration_required_threshold_months=12,
            platform_fee=299.0,
            provider_fee=100.0,
            version="GJ-TEST-11M",
            is_active=True,
        )
        self.rule_12m = LegalRule.objects.create(
            state_code="GJ",
            state_name="Gujarat",
            agreement_type=LegalRule.AgreementType.RESIDENTIAL,
            min_duration_months=12,
            max_duration_months=60,
            fixed_stamp_duty=0.0,
            rate_percentage=0.250,
            minimum_stamp_duty=500.0,
            registration_fee_fixed=1000.0,
            registration_required_threshold_months=12,
            platform_fee=499.0,
            provider_fee=150.0,
            version="GJ-TEST-12M",
            is_active=True,
        )

    # 1. Duty Calculator & Registration Required Logic
    def test_duty_calculator_11_months_no_registration(self):
        calc = LegalRuleEngine.calculate(15000, 30000, 11, "GJ")
        self.assertEqual(calc["government_stamp_duty"], 300.0)
        self.assertEqual(calc["registration_fee"], 0.0)
        self.assertFalse(calc["registration_required"])
        self.assertEqual(calc["total_payable"], 699.0)  # 300 + 0 + 100 + 299

    def test_duty_calculator_12_months_mandatory_registration(self):
        calc = LegalRuleEngine.calculate(20000, 40000, 12, "GJ")
        self.assertTrue(calc["registration_required"])
        self.assertGreater(calc["registration_fee"], 0.0)

    # 2. Mode A: Owner Creates Agreement
    def test_owner_creates_agreement(self):
        self.client.force_authenticate(user=self.owner)
        payload = {
            "property_title": "Shantigram 3BHK",
            "property_address": "Near Vaishnodevi Circle, SG Highway",
            "property_city": "Ahmedabad",
            "monthly_rent": 18000,
            "security_deposit": 36000,
            "duration_months": 11,
            "tenant_details": {
                "full_name": "Amit Shah",
                "email": "tenant@test.com",
                "phone": "9825000002",
            }
        }
        res = self.client.post("/api/v1/agreements/create-owner/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        data = res.data["data"]
        self.assertEqual(data["creator_type"], "OWNER")
        self.assertEqual(data["status"], "DRAFT")
        self.assertEqual(data["stamp_duty_amount"], "300.00")

    # 3. Mode B: Tenant Creates Agreement
    def test_tenant_creates_agreement(self):
        self.client.force_authenticate(user=self.tenant)
        payload = {
            "property_title": "Bodakdev Apartment",
            "monthly_rent": 12000,
            "security_deposit": 24000,
            "duration_months": 11,
            "owner_details": {
                "full_name": "Rajesh Patel",
                "email": "owner@test.com",
                "phone": "9825000001",
            }
        }
        res = self.client.post("/api/v1/agreements/create-tenant/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        data = res.data["data"]
        self.assertEqual(data["creator_type"], "TENANT")

    # 4. Mode C: Shop Operator Creates Assisted Agreement
    def test_shop_operator_creates_assisted_agreement(self):
        self.client.force_authenticate(user=self.shop_operator)
        payload = {
            "shop_id": str(self.shop.id),
            "property_title": "Paldi Studio Flat",
            "monthly_rent": 10000,
            "security_deposit": 20000,
            "duration_months": 11,
            "owner_details": {"full_name": "Ramesh Patel", "phone": "9825011111", "email": "ramesh@patel.com"},
            "tenant_details": {"full_name": "Ketan Dave", "phone": "9825022222", "email": "ketan@dave.com"},
        }
        res = self.client.post("/api/v1/agreements/create-assisted/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        data = res.data["data"]
        self.assertEqual(data["creator_type"], "SHOP")
        self.assertIsNotNone(data["kiosk_session"])

    # 5. Invitation System & Token Expiry
    def test_owner_invites_tenant_and_expiry(self):
        self.client.force_authenticate(user=self.owner)
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={"monthly_rent": 15000, "duration_months": 11}
        )
        invitation = AgreementService.send_invitation(
            agreement=agr,
            sender_user=self.owner,
            target_role="TENANT",
            target_name="Amit Shah",
            target_email="tenant@test.com",
            target_phone="9825000002"
        )
        self.assertIsNotNone(invitation.token)
        self.assertEqual(agr.status, Agreement.AgreementStatus.INVITATION_SENT)

        # Public invitation resolve
        self.client.logout()
        res = self.client.get(f"/api/v1/agreements/invitations/{invitation.token}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Invalid token check
        res_inv = self.client.get("/api/v1/agreements/invitations/invalid-token-12345/")
        self.assertEqual(res_inv.status_code, status.HTTP_404_NOT_FOUND)

        # Expired invitation
        invitation.expires_at = timezone.now() - timezone.timedelta(days=1)
        invitation.save()
        res_exp = self.client.get(f"/api/v1/agreements/invitations/{invitation.token}/")
        self.assertEqual(res_exp.status_code, status.HTTP_410_GONE)

    # 6. Tenant Accepts Invitation
    def test_tenant_accepts_invitation(self):
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={"monthly_rent": 15000, "duration_months": 11}
        )
        invitation = AgreementService.send_invitation(
            agr, self.owner, "TENANT", "Amit Shah", "tenant@test.com", "9825000002"
        )
        self.client.force_authenticate(user=self.tenant)
        res = self.client.post(f"/api/v1/agreements/invitations/{invitation.token}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        agr.refresh_from_db()
        self.assertEqual(agr.status, Agreement.AgreementStatus.TENANT_ACCEPTED)

    # 7. Independent Identity Verification & Transition to BOTH_VERIFIED
    def test_identity_verification_both_parties(self):
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={
                "monthly_rent": 15000,
                "duration_months": 11,
                "tenant_details": {"full_name": "Amit Shah", "email": "tenant@test.com", "phone": "9825000002"}
            }
        )
        owner_party = agr.parties.get(party_type=AgreementParty.PartyType.OWNER)
        tenant_party = agr.parties.get(party_type=AgreementParty.PartyType.TENANT)

        # Owner verifies
        res_owner = AgreementService.verify_party_identity(owner_party, "123456789012", "123456")
        self.assertTrue(res_owner["success"])
        owner_party.refresh_from_db()
        self.assertEqual(owner_party.verification_status, "VERIFIED")
        self.assertEqual(owner_party.aadhaar_masked, "XXXX-XXXX-9012")

        # Tenant verifies
        res_tenant = AgreementService.verify_party_identity(tenant_party, "987654321098", "123456")
        self.assertTrue(res_tenant["success"])
        tenant_party.refresh_from_db()
        self.assertEqual(tenant_party.verification_status, "VERIFIED")

        agr.refresh_from_db()
        self.assertEqual(agr.status, Agreement.AgreementStatus.BOTH_VERIFIED)

    # 8. Digital Signing, Version Locking, e-Stamping & Completion
    def test_signing_estamp_and_document_hash(self):
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={
                "monthly_rent": 15000,
                "duration_months": 11,
                "tenant_details": {"full_name": "Amit Shah", "email": "tenant@test.com", "phone": "9825000002"}
            }
        )
        owner_party = agr.parties.get(party_type=AgreementParty.PartyType.OWNER)
        tenant_party = agr.parties.get(party_type=AgreementParty.PartyType.TENANT)

        # Advance to review
        agr.status = Agreement.AgreementStatus.REVIEW_PENDING
        agr.save()

        # Sign owner
        AgreementService.record_signature(owner_party)
        owner_party.refresh_from_db()
        self.assertEqual(owner_party.signing_status, "SIGNED")

        # Sign tenant -> triggers auto e-stamping and completion
        AgreementService.record_signature(tenant_party)
        tenant_party.refresh_from_db()
        self.assertEqual(tenant_party.signing_status, "SIGNED")

        agr.refresh_from_db()
        self.assertEqual(agr.status, Agreement.AgreementStatus.COMPLETED)
        self.assertEqual(agr.stamp_status, "PENDING_ISSUANCE")
        self.assertTrue(agr.document_hash != "")
        self.assertTrue(bool(agr.final_pdf))

    # 9. Public QR Verification Masking
    def test_public_qr_verification_endpoint(self):
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={
                "monthly_rent": 15000,
                "duration_months": 11,
                "tenant_details": {"full_name": "Amit Shah", "email": "tenant@test.com", "phone": "9825000002"}
            }
        )
        self.client.logout()
        res = self.client.get(f"/api/v1/agreements/verify/{agr.public_verification_token}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data["data"]
        self.assertIn("owner_masked", data)
        self.assertIn("tenant_masked", data)
        # Verify Aadhaar is NOT in public payload
        self.assertNotIn("aadhaar_masked", str(res.data))
        self.assertNotIn("123456789012", str(res.data))

    # 10. Role-based Permission Isolation
    def test_tenant_cannot_access_other_tenant_agreement(self):
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={
                "monthly_rent": 15000,
                "duration_months": 11,
                "tenant_details": {"full_name": "Amit Shah", "email": "tenant@test.com", "phone": "9825000002"}
            }
        )
        agr.tenant_user = self.tenant
        agr.save()

        # Unrelated tenant
        self.client.force_authenticate(user=self.other_tenant)
        res = self.client.get(f"/api/v1/agreements/{agr.id}/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    # 11. Webhooks
    def test_webhook_idempotency_recording(self):
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={"monthly_rent": 15000, "duration_months": 11}
        )
        payload = {
            "event_id": "EVT-PAY-123",
            "agreement_id": str(agr.id),
            "status": "SUCCESS",
            "amount": 699.0,
        }
        res = self.client.post("/api/v1/agreements/webhooks/payment/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(agr.events.filter(event_type="WEBHOOK_PAYMENT_RECEIVED").exists())

    # 12. Immutability: Executed Agreement Rejects Modifications (Phase 7)
    def test_executed_agreement_modification_rejected(self):
        self.client.force_authenticate(user=self.owner)
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={"monthly_rent": 15000, "duration_months": 11}
        )
        agr.is_immutable = True
        agr.status = Agreement.AgreementStatus.EXECUTED
        agr.save()

        # Attempt to patch rent
        patch_res = self.client.patch(f"/api/v1/agreements/{agr.id}/", {"monthly_rent": 20000}, format="json")
        self.assertEqual(patch_res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("immutable", str(patch_res.data["error"]).lower())

    # 13. Jurisdiction Check: Unsupported State Rejection (Phase 8 & 28)
    def test_unsupported_state_rejection(self):
        calc = LegalRuleEngine.calculate(15000, 30000, 11, "XX")
        self.assertFalse(calc.get("supported"))
        self.assertIn("Currently unavailable", calc.get("message", ""))

    # 14. Declarations & Financial Terms Confirmation (Phases 4, 5, 6)
    def test_declarations_and_financial_confirmation(self):
        self.client.force_authenticate(user=self.owner)
        agr = AgreementService.create_agreement(
            creator_user=self.owner,
            creator_type=Agreement.CreatorType.OWNER,
            data={"monthly_rent": 15000, "duration_months": 11}
        )
        # Landlord declaration
        res_landlord = self.client.post(f"/api/v1/agreements/{agr.id}/confirm-landlord-declaration/")
        self.assertEqual(res_landlord.status_code, status.HTTP_200_OK)
        agr.refresh_from_db()
        self.assertTrue(agr.landlord_declaration_confirmed)

        # Financial terms confirmation
        res_fin = self.client.post(f"/api/v1/agreements/{agr.id}/confirm-financial-terms/")
        self.assertEqual(res_fin.status_code, status.HTTP_200_OK)
        agr.refresh_from_db()
        self.assertTrue(agr.financial_terms_confirmed)
