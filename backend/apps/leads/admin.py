from django.contrib import admin
from apps.leads.models import Lead, LeadActivity, Visit


class LeadActivityInline(admin.TabularInline):
    model = LeadActivity
    extra = 1


class VisitInline(admin.TabularInline):
    model = Visit
    extra = 1


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "phone",
        "email",
        "property",
        "source",
        "budget",
        "status",
        "assigned_staff",
        "created_at",
    )
    list_filter = ("status", "source", "gender", "created_at")
    search_fields = ("name", "phone", "email", "property__title", "preferred_location")
    inlines = [LeadActivityInline, VisitInline]


@admin.register(LeadActivity)
class LeadActivityAdmin(admin.ModelAdmin):
    list_display = ("lead", "activity_type", "user", "created_at")
    list_filter = ("activity_type", "created_at")
    search_fields = ("lead__name", "lead__phone", "note")


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ("lead", "property", "scheduled_at", "status", "assigned_staff", "created_at")
    list_filter = ("status", "scheduled_at")
    search_fields = ("lead__name", "lead__phone", "property__title", "feedback")
