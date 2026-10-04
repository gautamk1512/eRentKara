import uuid
from django.db import models
from apps.tenants.models import Tenancy
from apps.accounts.models import User

class Visitor(models.Model):
    class VisitorStatus(models.TextChoices):
        REQUESTED = "REQUESTED", "Requested by Tenant"
        APPROVED = "APPROVED", "Approved"
        CHECKED_IN = "CHECKED_IN", "Checked In"
        CHECKED_OUT = "CHECKED_OUT", "Checked Out"
        REJECTED = "REJECTED", "Rejected by Security"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenancy = models.ForeignKey(Tenancy, on_delete=models.CASCADE, related_name="visitors")
    visitor_name = models.CharField(max_length=150)
    visitor_phone = models.CharField(max_length=15)
    relation = models.CharField(max_length=50, blank=True, help_text="e.g. Parent, Friend, Colleague")
    purpose = models.CharField(max_length=200, default="Visit")
    expected_arrival = models.DateTimeField()
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=VisitorStatus.choices, default=VisitorStatus.REQUESTED)
    security_guard = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="checked_visitors")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.visitor_name} visiting {self.tenancy.tenant.email} ({self.get_status_display()})"
