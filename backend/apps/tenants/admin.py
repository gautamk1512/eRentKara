from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline
from unfold.decorators import display
from apps.tenants.models import Tenancy, MoveIn, MoveOut


class MoveInInline(StackedInline):
    model = MoveIn
    extra = 0


class MoveOutInline(StackedInline):
    model = MoveOut
    extra = 0


@admin.register(Tenancy)
class TenancyAdmin(ModelAdmin):
    list_display = (
        "tenant",
        "property",
        "room",
        "bed",
        "monthly_rent",
        "show_status",
        "start_date",
        "end_date",
        "created_at",
    )
    list_filter = ("status", "property__city", "start_date")
    search_fields = ("tenant__email", "tenant__first_name", "tenant__last_name", "property__title")
    inlines = [MoveInInline, MoveOutInline]
    list_filter_submit = True

    @display(
        description="Stay Status",
        label={
            Tenancy.TenancyStatus.ACTIVE: "success",
            Tenancy.TenancyStatus.PENDING: "warning",
            Tenancy.TenancyStatus.NOTICE: "danger",
            Tenancy.TenancyStatus.VACATED: "info",
            Tenancy.TenancyStatus.TERMINATED: "danger",
        }
    )
    def show_status(self, obj):
        return obj.get_status_display()


@admin.register(MoveIn)
class MoveInAdmin(ModelAdmin):
    list_display = ("tenancy", "actual_move_in_date", "keys_handed_over", "verified_by_staff")
    search_fields = ("tenancy__tenant__email", "tenancy__property__title")


@admin.register(MoveOut)
class MoveOutAdmin(ModelAdmin):
    list_display = ("tenancy", "notice_date", "expected_vacate_date", "final_refund_amount", "show_status")
    list_filter = ("status",)
    search_fields = ("tenancy__tenant__email", "tenancy__property__title")

    @display(
        description="Move-out Status",
        label={
            MoveOut.MoveOutStatus.COMPLETED: "success",
            MoveOut.MoveOutStatus.REQUESTED: "warning",
            MoveOut.MoveOutStatus.INSPECTION_PENDING: "info",
            MoveOut.MoveOutStatus.SETTLEMENT_PENDING: "danger",
        }
    )
    def show_status(self, obj):
        return obj.get_status_display()
