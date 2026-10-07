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
    AgreementPricingConfig,
    AgreementOrder,
    AgreementDocument,
    OrderEvent,
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
            "notary_status",
            "notary_advocate_name",
            "notary_registration_number",
            "notary_completed_at",
            "notary_notes",
            "police_verification_status",
            "police_verification_reference",
            "police_station_name",
            "police_application_date",
            "landlord_declaration_confirmed",
            "landlord_declaration_timestamp",
            "tenant_declaration_confirmed",
            "tenant_declaration_timestamp",
            "financial_terms_confirmed",
            "financial_terms_confirmed_at",
            "advance_rent",
            "other_charges",
            "is_immutable",
            "amendment_of",
            "finalized_at",
            "signed_at",
            "stamped_at",
            "executed_at",
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


# =============================================================================
# New Fulfilment & Order Serializers
# =============================================================================

class AgreementPricingConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgreementPricingConfig
        fields = [
            "id", "soft_copy_fee", "hard_copy_fee", "printing_fee",
            "courier_fee", "partner_fee", "service_fee", "commercial_fee",
            "expected_sla_days", "sla_display_text"
        ]


class OrderEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderEvent
        fields = [
            "id", "action", "previous_status", "new_status",
            "reference_id", "notes", "created_at"
        ]


class AgreementDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source="get_document_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = AgreementDocument
        fields = [
            "id", "document_type", "document_type_display",
            "file_name", "file_size", "status", "status_display",
            "validation_notes", "file_url", "uploaded_at"
        ]

    def get_file_url(self, obj):
        if obj.file:
            return f"/api/v1/agreements/document-downloads/{obj.pk}/"
        return None


class AgreementOrderSerializer(serializers.ModelSerializer):
    customer_view = serializers.SerializerMethodField()
    agreement_title = serializers.CharField(source="agreement.property_title", read_only=True)
    monthly_rent = serializers.DecimalField(source="agreement.monthly_rent", max_digits=10, decimal_places=2, read_only=True)
    security_deposit = serializers.DecimalField(source="agreement.security_deposit", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = AgreementOrder
        fields = [
            "id", "order_number", "agreement", "agreement_title",
            "monthly_rent", "security_deposit", "delivery_type",
            "status", "service_amount", "hard_copy_fee",
            "courier_fee", "printing_fee", "total_amount",
            "payment_status", "payment_id", "paid_at",
            "created_at", "expected_completion_at", "completed_at",
            "customer_view", "is_overdue"
        ]

    def get_customer_view(self, obj):
        return obj.get_customer_view()


class AgreementOrderDetailSerializer(serializers.ModelSerializer):
    customer_view = serializers.SerializerMethodField()
    agreement_details = serializers.SerializerMethodField()
    timeline_events = serializers.SerializerMethodField()
    documents = AgreementDocumentSerializer(many=True, read_only=True)
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = AgreementOrder
        fields = [
            "id", "order_number", "agreement", "agreement_details",
            "delivery_type", "status", "recipient_name",
            "recipient_phone", "delivery_address", "delivery_city",
            "delivery_state", "delivery_pincode", "service_amount",
            "hard_copy_fee", "courier_fee", "printing_fee",
            "total_amount", "payment_status", "payment_id",
            "paid_at", "created_at", "expected_completion_at",
            "completed_at", "customer_view", "timeline_events",
            "documents", "download_url", "is_overdue",
            "correction_requested", "correction_reason"
        ]

    def get_customer_view(self, obj):
        return obj.get_customer_view()

    def get_agreement_details(self, obj):
        agr = obj.agreement
        return {
            "agreement_number": agr.agreement_number,
            "property_title": agr.property_title,
            "property_address": agr.property_address,
            "property_city": agr.property_city,
            "property_state": agr.property_state,
            "monthly_rent": float(agr.monthly_rent),
            "security_deposit": float(agr.security_deposit),
            "duration_months": agr.duration_months,
            "start_date": str(agr.start_date),
            "end_date": str(agr.end_date) if agr.end_date else None,
            "owner_name": agr.owner_user.get_full_name() if agr.owner_user else "",
            "tenant_name": agr.tenant_user.get_full_name() if agr.tenant_user else "",
        }

    def get_timeline_events(self, obj):
        events = obj.events.filter(is_customer_visible=True).order_by("created_at")
        return OrderEventSerializer(events, many=True).data

    def get_download_url(self, obj):
        if obj.final_document and obj.qc_status == "PASSED" and obj.status in [
            AgreementOrder.OrderStatus.FINAL_DOCUMENT_READY,
            AgreementOrder.OrderStatus.EMAIL_DELIVERY_PENDING,
            AgreementOrder.OrderStatus.EMAIL_DELIVERED,
            AgreementOrder.OrderStatus.PRINTING_PENDING,
            AgreementOrder.OrderStatus.PRINTED,
            AgreementOrder.OrderStatus.COURIER_PENDING,
            AgreementOrder.OrderStatus.COURIER_BOOKED,
            AgreementOrder.OrderStatus.OUT_FOR_DELIVERY,
            AgreementOrder.OrderStatus.DELIVERED,
            AgreementOrder.OrderStatus.COMPLETED,
        ]:
            return f"/api/v1/agreements/orders/{obj.pk}/download/"
        return None



class AdminAgreementOrderSerializer(AgreementOrderDetailSerializer):
    assigned_partner = serializers.SerializerMethodField()
    class Meta(AgreementOrderDetailSerializer.Meta):
        fields = AgreementOrderDetailSerializer.Meta.fields + ["assigned_partner", "qc_status", "qc_notes", "internal_notes", "partner_fee"]
    def get_assigned_partner(self, obj):
        if obj.assigned_partner:
            return {"id": str(obj.assigned_partner_id), "name": obj.assigned_partner.get_full_name(), "phone": obj.assigned_partner.phone_number}
        return None
