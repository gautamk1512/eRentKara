from rest_framework import serializers
from apps.agreements.models import (
    Agreement,
    AgreementParty,
    AgreementVersion,
    AgreementInvitation,
    AgreementEvent,
    LegalRule,
    AgreementClause,
    Shop,
    ShopOperator,
    KioskSession,
    StateConfiguration,
    AgreementSigner,
)


class StateConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StateConfiguration
        fields = "__all__"


class LegalRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalRule
        fields = "__all__"


class AgreementClauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgreementClause
        fields = "__all__"


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = [
            "id", "shop_code", "name", "city", "district", "state",
            "address", "phone", "email", "is_approved", "is_active",
            "commission_per_agreement"
        ]


class KioskSessionSerializer(serializers.ModelSerializer):
    shop_name = serializers.CharField(source="shop.name", read_only=True)
    operator_name = serializers.CharField(source="operator.get_full_name", read_only=True)

    class Meta:
        model = KioskSession
        fields = [
            "id", "session_code", "shop", "shop_name", "operator",
            "operator_name", "status", "started_at", "expires_at"
        ]


class AgreementPartySerializer(serializers.ModelSerializer):
    party_type_display = serializers.CharField(source="get_party_type_display", read_only=True)
    verification_status_display = serializers.CharField(source="get_verification_status_display", read_only=True)
    signing_status_display = serializers.CharField(source="get_signing_status_display", read_only=True)

    class Meta:
        model = AgreementParty
        fields = [
            "id", "party_type", "party_type_display", "full_name",
            "email", "phone", "aadhaar_masked", "address",
            "verification_status", "verification_status_display",
            "verification_provider", "verified_at",
            "signing_status", "signing_status_display", "sign_url",
            "signed_at"
        ]
        read_only_fields = [
            "verification_status", "verified_at", "signing_status",
            "sign_url", "signed_at", "verification_provider"
        ]


class AgreementVersionSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = AgreementVersion
        fields = [
            "id", "version_number", "document_hash", "created_by_name",
            "change_reason", "is_locked", "created_at"
        ]


class AgreementEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgreementEvent
        fields = ["id", "event_type", "description", "metadata", "created_at"]


class AgreementInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgreementInvitation
        fields = [
            "id", "token", "target_role", "target_name", "target_email",
            "target_phone", "is_used", "expires_at", "created_at"
        ]
        read_only_fields = ["token", "is_used", "created_at"]


class AgreementSignerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgreementSigner
        fields = ["id", "signer_role", "name", "email", "phone", "sign_url", "is_signed", "signed_at"]


class AgreementSerializer(serializers.ModelSerializer):
    parties = AgreementPartySerializer(many=True, read_only=True)
    versions = AgreementVersionSerializer(many=True, read_only=True)
    events = AgreementEventSerializer(many=True, read_only=True)
    signers = AgreementSignerSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    creator_type_display = serializers.CharField(source="get_creator_type_display", read_only=True)
    tenant_name = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Agreement
        fields = [
            "id",
            "agreement_number",
            "creator_type",
            "creator_type_display",
            "created_by",
            "owner_user",
            "tenant_user",
            "owner_name",
            "tenant_name",
            "shop",
            "kiosk_session",
            "property_title",
            "property_address",
            "property_city",
            "property_state",
            "property_pincode",
            "property_category",
            "agreement_type",
            "language",
            "monthly_rent",
            "security_deposit",
            "maintenance_amount",
            "duration_months",
            "start_date",
            "end_date",
            "notice_period_days",
            "lock_in_months",
            "status",
            "status_display",
            "state_code",
            "stamp_duty_amount",
            "registration_fee",
            "platform_fee",
            "provider_fee",
            "total_agreement_fee",
            "registration_required",
            "registration_reference",
            "stamp_status",
            "stamp_provider",
            "stamp_certificate_number",
            "stamp_certificate_url",
            "esign_status",
            "esign_provider",
            "esign_provider_document_id",
            "audit_trail_url",
            "payment_status",
            "final_pdf",
            "document_hash",
            "public_verification_token",
            "current_version_number",
            "parties",
            "versions",
            "events",
            "signers",
            "created_at",
            "updated_at",
            "completed_at",
        ]
        read_only_fields = [
            "id", "agreement_number", "document_hash",
            "public_verification_token", "created_at", "updated_at", "completed_at"
        ]

    def get_tenant_name(self, obj):
        tenant_p = obj.parties.filter(party_type=AgreementParty.PartyType.TENANT).first()
        if tenant_p:
            return tenant_p.full_name
        if obj.tenancy and obj.tenancy.tenant:
            return obj.tenancy.tenant.get_full_name()
        return "Tenant"

    def get_owner_name(self, obj):
        owner_p = obj.parties.filter(party_type=AgreementParty.PartyType.OWNER).first()
        if owner_p:
            return owner_p.full_name
        if obj.created_by and obj.creator_type == Agreement.CreatorType.OWNER:
            return obj.created_by.get_full_name()
        return "Owner"


class PublicAgreementVerificationSerializer(serializers.ModelSerializer):
    """
    Public QR-code verification endpoint.
    Strictly masks sensitive identities (PII protection).
    Never exposes full Aadhaar, PAN, phone or private address.
    """
    owner_masked = serializers.SerializerMethodField()
    tenant_masked = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Agreement
        fields = [
            "agreement_number",
            "agreement_type",
            "status",
            "status_display",
            "stamp_status",
            "stamp_certificate_number",
            "document_hash",
            "duration_months",
            "property_city",
            "property_state",
            "owner_masked",
            "tenant_masked",
            "created_at",
            "completed_at",
        ]

    def _mask_name(self, name: str) -> str:
        if not name:
            return "N/A"
        parts = name.split()
        masked_parts = []
        for p in parts:
            if len(p) <= 2:
                masked_parts.append(p[0] + "*")
            else:
                masked_parts.append(p[0] + "*" * (len(p) - 2) + p[-1])
        return " ".join(masked_parts)

    def get_owner_masked(self, obj):
        owner = obj.parties.filter(party_type=AgreementParty.PartyType.OWNER).first()
        return {
            "name": self._mask_name(owner.full_name if owner else "Owner"),
            "verification_status": owner.verification_status if owner else "PENDING",
            "signed": owner.signing_status == "SIGNED" if owner else False,
        }

    def get_tenant_masked(self, obj):
        tenant = obj.parties.filter(party_type=AgreementParty.PartyType.TENANT).first()
        return {
            "name": self._mask_name(tenant.full_name if tenant else "Tenant"),
            "verification_status": tenant.verification_status if tenant else "PENDING",
            "signed": tenant.signing_status == "SIGNED" if tenant else False,
        }
