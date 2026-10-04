from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import display
from apps.payments.models import Payment, PaymentAttempt


class PaymentAttemptInline(TabularInline):
    model = PaymentAttempt
    extra = 0
    readonly_fields = ("created_at", "provider_event_id", "response_code", "is_verified")


@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = (
        "receipt_number",
        "organization",
        "tenancy",
        "amount",
        "payment_type",
        "payment_method",
        "show_status",
        "show_reconciled",
        "created_at",
    )
    list_filter = ("status", "payment_type", "payment_method", "is_reconciled")
    search_fields = (
        "receipt_number",
        "gateway_order_id",
        "gateway_payment_id",
        "tenancy__tenant__email",
        "organization__name",
    )
    readonly_fields = ("receipt_number", "created_at", "updated_at", "reconciled_at")
    inlines = [PaymentAttemptInline]
    list_filter_submit = True

    @display(
        description="Payment Status",
        label={
            Payment.PaymentStatus.SUCCESS: "success",
            Payment.PaymentStatus.PENDING: "warning",
            Payment.PaymentStatus.CREATED: "info",
            Payment.PaymentStatus.FAILED: "danger",
            Payment.PaymentStatus.REFUNDED: "info",
            Payment.PaymentStatus.CANCELLED: "danger",
        }
    )
    def show_status(self, obj):
        return obj.get_status_display()

    @display(
        description="Reconciled",
        label={
            True: "success",
            False: "warning",
        }
    )
    def show_reconciled(self, obj):
        return "Reconciled" if obj.is_reconciled else "Pending Reconcile"


@admin.register(PaymentAttempt)
class PaymentAttemptAdmin(ModelAdmin):
    list_display = ("payment", "provider_event_id", "response_code", "is_verified", "created_at")
    list_filter = ("is_verified", "created_at")
    search_fields = ("provider_event_id", "payment__receipt_number", "response_code")
    readonly_fields = ("created_at",)
