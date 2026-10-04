from django.contrib import admin
from apps.deposits.models import SecurityDeposit, DepositSettlement


class DepositSettlementInline(admin.StackedInline):
    model = DepositSettlement
    extra = 0


@admin.register(SecurityDeposit)
class SecurityDepositAdmin(admin.ModelAdmin):
    list_display = ("tenancy", "amount_total", "amount_collected", "status", "collected_date", "created_at")
    list_filter = ("status", "collected_date")
    search_fields = ("tenancy__tenant__email", "tenancy__property__title")
    inlines = [DepositSettlementInline]


@admin.register(DepositSettlement)
class DepositSettlementAdmin(admin.ModelAdmin):
    list_display = ("deposit", "refund_amount", "settlement_date", "refund_transaction_reference", "created_at")
    list_filter = ("settlement_date",)
    search_fields = ("deposit__tenancy__tenant__email", "refund_transaction_reference", "notes")
