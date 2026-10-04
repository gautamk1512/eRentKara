from django.contrib import admin
from apps.subscriptions.models import SubscriptionPlan, OrganizationSubscription


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ("name", "price_monthly", "price_annual", "max_properties", "max_rooms", "max_beds", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(OrganizationSubscription)
class OrganizationSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("organization", "plan", "status", "starts_at", "expires_at", "auto_renew")
    list_filter = ("status", "auto_renew", "plan")
    search_fields = ("organization__name", "plan__name")
