from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import display
from apps.billing.models import Invoice, InvoiceItem, ElectricityReading


class InvoiceItemInline(TabularInline):
    model = InvoiceItem
    extra = 1


@admin.register(Invoice)
class InvoiceAdmin(ModelAdmin):
    list_display = (
        "invoice_number",
        "tenancy",
        "billing_month",
        "billing_year",
        "total_amount",
        "paid_amount",
        "show_status",
        "due_date",
        "created_at",
    )
    list_filter = ("status", "billing_year", "billing_month")
    search_fields = ("invoice_number", "tenancy__tenant__email", "tenancy__property__title")
    inlines = [InvoiceItemInline]
    list_filter_submit = True

    @display(
        description="Invoice Status",
        label={
            Invoice.InvoiceStatus.PAID: "success",
            Invoice.InvoiceStatus.ISSUED: "warning",
            Invoice.InvoiceStatus.PARTIALLY_PAID: "info",
            Invoice.InvoiceStatus.OVERDUE: "danger",
            Invoice.InvoiceStatus.CANCELLED: "danger",
            Invoice.InvoiceStatus.DRAFT: "info",
        }
    )
    def show_status(self, obj):
        return obj.get_status_display()


@admin.register(ElectricityReading)
class ElectricityReadingAdmin(ModelAdmin):
    list_display = ("property", "room", "meter_number", "reading_date", "previous_reading", "current_reading", "rate_per_unit", "units_consumed_display", "total_cost_display")
    list_filter = ("reading_date",)
    search_fields = ("property__title", "room__room_number", "meter_number")

    def units_consumed_display(self, obj):
        return f"{obj.get_units_consumed()} kWh"

    def total_cost_display(self, obj):
        return f"₹{obj.get_total_cost():.2f}"


@admin.register(InvoiceItem)
class InvoiceItemAdmin(ModelAdmin):
    list_display = ("invoice", "title", "amount", "category")
    list_filter = ("category",)
    search_fields = ("title", "invoice__invoice_number")
