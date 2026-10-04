from django.contrib import admin
from apps.kyc.models import KYC, KYCDocument


class KYCDocumentInline(admin.TabularInline):
    model = KYCDocument
    extra = 1


@admin.register(KYC)
class KYCAdmin(admin.ModelAdmin):
    list_display = ("user", "tenancy", "status", "verified_by", "verified_at", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__email", "user__first_name", "user__last_name", "tenancy__property__title")
    inlines = [KYCDocumentInline]


@admin.register(KYCDocument)
class KYCDocumentAdmin(admin.ModelAdmin):
    list_display = ("kyc", "document_type", "masked_document_number", "is_verified", "uploaded_at")
    list_filter = ("document_type", "is_verified")
    search_fields = ("masked_document_number", "kyc__user__email")
