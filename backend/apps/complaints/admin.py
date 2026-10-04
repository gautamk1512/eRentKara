from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline
from unfold.decorators import display
from apps.complaints.models import Complaint, MaintenanceTicket


class MaintenanceTicketInline(StackedInline):
    model = MaintenanceTicket
    extra = 0


@admin.register(Complaint)
class ComplaintAdmin(ModelAdmin):
    list_display = (
        "ticket_number",
        "title",
        "property",
        "category",
        "show_urgency",
        "show_status",
        "assigned_staff",
        "created_at",
    )
    list_filter = ("category", "urgency", "status", "property__city")
    search_fields = ("ticket_number", "title", "description", "property__title", "tenancy__tenant__email")
    readonly_fields = ("ticket_number", "created_at", "updated_at")
    inlines = [MaintenanceTicketInline]
    list_filter_submit = True

    @display(
        description="Urgency",
        label={
            Complaint.Urgency.EMERGENCY: "danger",
            Complaint.Urgency.HIGH: "danger",
            Complaint.Urgency.MEDIUM: "warning",
            Complaint.Urgency.LOW: "info",
        }
    )
    def show_urgency(self, obj):
        return obj.get_urgency_display()

    @display(
        description="Status",
        label={
            Complaint.ComplaintStatus.RESOLVED: "success",
            Complaint.ComplaintStatus.CLOSED: "success",
            Complaint.ComplaintStatus.IN_PROGRESS: "warning",
            Complaint.ComplaintStatus.ASSIGNED: "info",
            Complaint.ComplaintStatus.OPEN: "danger",
            Complaint.ComplaintStatus.WAITING: "warning",
        }
    )
    def show_status(self, obj):
        return obj.get_status_display()


@admin.register(MaintenanceTicket)
class MaintenanceTicketAdmin(ModelAdmin):
    list_display = ("complaint", "vendor_name", "vendor_phone", "estimated_cost", "actual_cost", "completed_at")
    search_fields = ("complaint__ticket_number", "vendor_name", "vendor_phone")
