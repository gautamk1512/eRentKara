from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline, StackedInline
from django.utils.html import format_html
from apps.agreements.models import (
    Agreement,
    AgreementParty,
    AgreementTemplate,
    AgreementVersion,
    AgreementInvitation,
    AgreementEvent,
    LegalRule,
    AgreementClause,
    Shop,
    ShopOperator,
    KioskSession,
    StateConfiguration,
    UserIdentityVerification,
    SigningTransaction,
    AgreementPayment,
    CourierOrder,
    AgreementRenewal,
    AgreementCancellation,
    LegalNotice,
)


class AgreementPartyInline(TabularInline):
    model = AgreementParty
    extra = 0
    fields = (
        "party_type",
        "full_name",
        "email",
        "phone",
        "aadhaar_masked",
        "verification_status",
        "signing_status",
        "verified_at",
        "signed_at",
    )
    readonly_fields = ("verified_at", "signed_at", "verification_reference", "signature_reference")


class AgreementPaymentInline(TabularInline):
    model = AgreementPayment
    extra = 0
    fields = ("payer", "amount", "government_amount", "platform_amount", "status", "gateway", "paid_at")
    readonly_fields = ("paid_at", "created_at")


class SigningTransactionInline(TabularInline):
    model = SigningTransaction
    extra = 0
    fields = ("party_type", "provider", "status", "signed_at", "document_hash_before_sign", "document_hash_after_sign")
    readonly_fields = ("created_at", "signed_at")


class AgreementVersionInline(TabularInline):
    model = AgreementVersion
    extra = 0
    fields = ("version_number", "document_hash", "created_by", "change_reason", "is_locked", "created_at")
    readonly_fields = ("version_number", "document_hash", "is_locked", "created_at")


class AgreementEventInline(TabularInline):
    model = AgreementEvent
    extra = 0
    fields = ("event_type", "description", "metadata", "created_at")
    readonly_fields = ("event_type", "description", "metadata", "created_at")


@admin.register(Agreement)
class AgreementAdmin(ModelAdmin):
    list_display = (
        "agreement_number",
        "creator_type",
        "owner_display",
        "tenant_display",
        "status_badge",
        "monthly_rent",
        "stamp_duty_amount",
        "stamp_certificate_number",
        "stamp_status",
        "esign_status",
        "pdf_download_link",
        "created_at",
    )
    list_filter = (
        "status",
        "creator_type",
        "state_code",
        "registration_required",
        "stamp_status",
        "esign_status",
        "payment_status",
        "language",
    )
    search_fields = (
        "agreement_number",
        "property_title",
        "property_city",
        "property_address",
        "stamp_certificate_number",
        "document_hash",
        "parties__full_name",
        "parties__email",
        "parties__phone",
    )
    readonly_fields = (
        "agreement_number",
        "public_verification_token",
        "document_hash",
        "created_at",
        "updated_at",
        "completed_at",
        "pdf_preview",
    )
    inlines = [
        AgreementPartyInline,
        AgreementPaymentInline,
        SigningTransactionInline,
        AgreementVersionInline,
        AgreementEventInline,
    ]

    fieldsets = (
        ("Core Agreement Identifiers", {
            "fields": (
                "agreement_number",
                "creator_type",
                "created_by",
                "owner_user",
                "tenant_user",
                "shop",
                "kiosk_session",
                "status",
            )
        }),
        ("Property Details", {
            "fields": (
                "property_title",
                "property_address",
                "property_city",
                "property_state",
                "property_pincode",
                "property_category",
                "agreement_type",
                "language",
            )
        }),
        ("Financial & Tenancy Terms", {
            "fields": (
                "monthly_rent",
                "security_deposit",
                "maintenance_amount",
                "duration_months",
                "start_date",
                "end_date",
                "notice_period_days",
                "lock_in_months",
                "escalation_percent",
            )
        }),
        ("e-Stamping & Sub-Registrar Compliance", {
            "fields": (
                "state_code",
                "rule_applied",
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
            )
        }),
        ("Digital eSign & Security", {
            "fields": (
                "esign_status",
                "esign_provider",
                "esign_provider_document_id",
                "audit_trail_url",
                "document_hash",
                "public_verification_token",
                "current_version_number",
                "final_pdf",
                "pdf_preview",
            )
        }),
        ("Audit Dates", {
            "fields": ("created_at", "updated_at", "completed_at")
        }),
    )

    def owner_display(self, obj):
        party = obj.parties.filter(party_type=AgreementParty.PartyType.OWNER).first()
        if party:
            return f"{party.full_name} ({party.verification_status})"
        if obj.owner_user:
            return obj.owner_user.email
        return "—"
    owner_display.short_description = "Owner (Landlord)"

    def tenant_display(self, obj):
        party = obj.parties.filter(party_type=AgreementParty.PartyType.TENANT).first()
        if party:
            return f"{party.full_name} ({party.verification_status})"
        if obj.tenant_user:
            return obj.tenant_user.email
        return "—"
    tenant_display.short_description = "Tenant (Renter)"

    def status_badge(self, obj):
        colors_map = {
            "COMPLETED": "#059669",
            "STAMPED": "#0284c7",
            "BOTH_SIGNED": "#2563eb",
            "BOTH_VERIFIED": "#7c3aed",
            "DRAFT": "#64748b",
            "CANCELLED": "#dc2626",
        }
        color = colors_map.get(obj.status, "#475569")
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px;">{}</span>',
            color,
            obj.get_status_display(),
        )
    status_badge.short_description = "Status"

    def pdf_download_link(self, obj):
        if obj.final_pdf:
            return format_html(
                '<a href="{}" target="_blank" style="color: #0284c7; font-weight: bold;">Download PDF</a>',
                obj.final_pdf.url,
            )
        return "—"
    pdf_download_link.short_description = "Executed PDF"

    def pdf_preview(self, obj):
        if obj.final_pdf:
            return format_html(
                '<a href="{}" target="_blank" class="button" style="padding: 6px 12px; background: #0284c7; color: white; border-radius: 6px; text-decoration: none;">Download Official Executed Deed PDF</a>',
                obj.final_pdf.url,
            )
        return "No PDF generated yet"
    pdf_preview.short_description = "PDF Deed"


@admin.register(AgreementParty)
class AgreementPartyAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "party_type",
        "agreement",
        "email",
        "phone",
        "aadhaar_masked",
        "verification_status",
        "signing_status",
        "verified_at",
        "signed_at",
    )
    list_filter = ("party_type", "verification_status", "signing_status")
    search_fields = (
        "full_name",
        "email",
        "phone",
        "aadhaar_masked",
        "agreement__agreement_number",
        "verification_reference",
    )
    readonly_fields = ("verified_at", "signed_at")


@admin.register(UserIdentityVerification)
class UserIdentityVerificationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "verified_name",
        "masked_aadhaar",
        "verification_type",
        "provider",
        "status",
        "identity_verified",
        "mobile_verified",
        "verified_at",
        "created_at",
    )
    list_filter = ("status", "verification_type", "provider", "identity_verified", "mobile_verified")
    search_fields = ("user__email", "verified_name", "masked_aadhaar", "provider_reference")
    readonly_fields = ("created_at", "updated_at", "verified_at")


@admin.register(SigningTransaction)
class SigningTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "agreement",
        "party_type",
        "provider",
        "status",
        "signed_at",
        "document_hash_after_sign",
        "created_at",
    )
    list_filter = ("status", "party_type", "provider")
    search_fields = (
        "agreement__agreement_number",
        "provider_transaction_id",
        "document_hash_before_sign",
        "document_hash_after_sign",
    )
    readonly_fields = ("created_at", "signed_at")


@admin.register(AgreementPayment)
class AgreementPaymentAdmin(admin.ModelAdmin):
    list_display = (
        "agreement",
        "payer",
        "amount",
        "government_amount",
        "platform_amount",
        "status",
        "gateway",
        "gateway_payment_id",
        "paid_at",
        "created_at",
    )
    list_filter = ("status", "gateway", "currency")
    search_fields = (
        "agreement__agreement_number",
        "payer__email",
        "gateway_order_id",
        "gateway_payment_id",
        "invoice_id",
    )
    readonly_fields = ("created_at", "paid_at")


@admin.register(CourierOrder)
class CourierOrderAdmin(admin.ModelAdmin):
    list_display = (
        "agreement",
        "recipient_name",
        "recipient_phone",
        "city",
        "provider",
        "tracking_number",
        "status",
        "dispatched_at",
        "delivered_at",
    )
    list_filter = ("status", "provider", "city", "state")
    search_fields = ("agreement__agreement_number", "recipient_name", "recipient_phone", "tracking_number")
    readonly_fields = ("created_at", "dispatched_at", "delivered_at")


@admin.register(LegalRule)
class LegalRuleAdmin(admin.ModelAdmin):
    list_display = (
        "state_code",
        "state_name",
        "agreement_type",
        "version",
        "min_duration_months",
        "max_duration_months",
        "fixed_stamp_duty",
        "rate_percentage",
        "registration_required_threshold_months",
        "platform_fee",
        "is_active",
        "effective_from",
    )
    list_filter = ("state_code", "agreement_type", "is_active")
    search_fields = ("state_name", "version", "notes", "source_reference")


@admin.register(AgreementClause)
class AgreementClauseAdmin(admin.ModelAdmin):
    list_display = ("title_en", "title_gu", "title_hi", "category", "is_mandatory", "display_order", "is_active", "version")
    list_filter = ("category", "is_mandatory", "is_active")
    search_fields = ("title_en", "title_gu", "title_hi", "content_en", "content_gu", "content_hi")


@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = (
        "shop_code",
        "name",
        "owner_user",
        "city",
        "district",
        "phone",
        "is_approved",
        "is_active",
        "commission_per_agreement",
        "created_at",
    )
    list_filter = ("city", "district", "is_approved", "is_active")
    search_fields = ("name", "shop_code", "phone", "email", "owner_user__email")


@admin.register(ShopOperator)
class ShopOperatorAdmin(admin.ModelAdmin):
    list_display = ("shop", "user", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("shop__name", "shop__shop_code", "user__email")


@admin.register(KioskSession)
class KioskSessionAdmin(admin.ModelAdmin):
    list_display = (
        "session_code",
        "shop",
        "operator",
        "owner_user",
        "tenant_user",
        "status",
        "started_at",
        "expires_at",
    )
    list_filter = ("status", "shop__city")
    search_fields = (
        "session_code",
        "shop__name",
        "operator__email",
        "owner_user__email",
        "tenant_user__email",
    )
    readonly_fields = ("started_at", "last_activity")


@admin.register(AgreementInvitation)
class AgreementInvitationAdmin(admin.ModelAdmin):
    list_display = (
        "token",
        "agreement",
        "target_name",
        "target_role",
        "target_email",
        "target_phone",
        "is_used",
        "expires_at",
        "created_at",
    )
    list_filter = ("target_role", "is_used")
    search_fields = ("token", "target_name", "target_email", "target_phone", "agreement__agreement_number")
    readonly_fields = ("created_at", "used_at")


@admin.register(AgreementEvent)
class AgreementEventAdmin(admin.ModelAdmin):
    list_display = ("agreement", "event_type", "description", "created_at")
    list_filter = ("event_type",)
    search_fields = ("agreement__agreement_number", "description")
    readonly_fields = ("created_at",)


@admin.register(StateConfiguration)
class StateConfigurationAdmin(admin.ModelAdmin):
    list_display = ("state_code", "state_name", "stamp_duty_type", "base_stamp_duty", "registration_fee", "e_stamping_supported")
    search_fields = ("state_code", "state_name")


@admin.register(AgreementRenewal)
class AgreementRenewalAdmin(admin.ModelAdmin):
    list_display = (
        "original_agreement",
        "renewed_agreement",
        "revised_rent",
        "revised_deposit",
        "renewal_duration_months",
        "status",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = ("original_agreement__agreement_number",)


@admin.register(AgreementCancellation)
class AgreementCancellationAdmin(admin.ModelAdmin):
    list_display = (
        "agreement",
        "initiated_by",
        "initiator_role",
        "notice_date",
        "effective_date",
        "mutual_consent",
        "status",
    )
    list_filter = ("status", "initiator_role", "mutual_consent")
    search_fields = ("agreement__agreement_number", "initiated_by__email", "cancellation_reason")


@admin.register(LegalNotice)
class LegalNoticeAdmin(admin.ModelAdmin):
    list_display = ("agreement", "notice_type", "title", "sender_role", "recipient_role", "dispatch_mode", "is_acknowledged", "created_at")
    list_filter = ("notice_type", "dispatch_mode", "is_acknowledged", "sender_role", "recipient_role")
    search_fields = ("agreement__agreement_number", "title", "postal_tracking_number", "description")


@admin.register(AgreementTemplate)
class AgreementTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "state", "is_default", "created_at")
    list_filter = ("is_default", "state")
    search_fields = ("name", "template_text")


@admin.register(AgreementVersion)
class AgreementVersionAdmin(admin.ModelAdmin):
    list_display = ("agreement", "version_number", "created_by", "change_reason", "is_locked", "created_at")
    list_filter = ("is_locked", "created_at")
    search_fields = ("agreement__agreement_number", "change_reason", "document_hash")
