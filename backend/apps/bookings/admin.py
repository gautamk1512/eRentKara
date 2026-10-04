from django.contrib import admin
from apps.bookings.models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_reference",
        "tenant_name",
        "tenant_phone",
        "property",
        "room",
        "bed",
        "token_amount",
        "monthly_rent",
        "status",
        "move_in_date",
        "created_at",
    )
    list_filter = ("status", "move_in_date", "created_at")
    search_fields = ("booking_reference", "tenant_name", "tenant_phone", "tenant_email", "property__title")
    readonly_fields = ("booking_reference", "created_at", "updated_at")
