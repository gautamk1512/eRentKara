from django.contrib import admin
from apps.visitors.models import Visitor


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = (
        "visitor_name",
        "visitor_phone",
        "relation",
        "tenancy",
        "expected_arrival",
        "check_in_time",
        "check_out_time",
        "status",
        "security_guard",
        "created_at",
    )
    list_filter = ("status", "expected_arrival")
    search_fields = ("visitor_name", "visitor_phone", "tenancy__tenant__email", "tenancy__property__title")
