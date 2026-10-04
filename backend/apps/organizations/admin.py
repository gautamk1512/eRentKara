from django.contrib import admin
from apps.organizations.models import Organization, OrganizationMember


class OrganizationMemberInline(admin.TabularInline):
    model = OrganizationMember
    extra = 1


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "contact_email", "contact_phone", "is_active", "is_verified", "created_at")
    list_filter = ("city", "is_active", "is_verified")
    search_fields = ("name", "legal_business_name", "gstin", "pan", "contact_email")
    inlines = [OrganizationMemberInline]


@admin.register(OrganizationMember)
class OrganizationMemberAdmin(admin.ModelAdmin):
    list_display = ("organization", "user", "role", "is_active", "joined_at")
    list_filter = ("role", "is_active")
    search_fields = ("organization__name", "user__email", "user__first_name", "user__last_name")
