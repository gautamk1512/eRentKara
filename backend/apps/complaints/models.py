import uuid
from django.db import models
from apps.organizations.models import Organization
from apps.properties.models import Property
from apps.tenants.models import Tenancy
from apps.accounts.models import User

class Complaint(models.Model):
    class ComplaintCategory(models.TextChoices):
        PLUMBING = "PLUMBING", "Plumbing & Water"
        ELECTRICAL = "ELECTRICAL", "Electrical & Wiring"
        CARPENTRY = "CARPENTRY", "Carpentry & Furniture"
        APPLIANCE = "APPLIANCE", "Geyser / AC / RO Appliance"
        CLEANING = "CLEANING", "Room / Washroom Cleaning"
        WIFI = "WIFI", "Internet & WiFi"
        FOOD = "FOOD", "Mess / Food Quality"
        NOISE = "NOISE", "Noise & Disturbance"
        SECURITY = "SECURITY", "Safety & Security"
        OTHER = "OTHER", "Other"

    class Urgency(models.TextChoices):
        LOW = "LOW", "Low (Within 3 days)"
        MEDIUM = "MEDIUM", "Medium (Within 24 hours)"
        HIGH = "HIGH", "High (Urgent, within 6 hours)"
        EMERGENCY = "EMERGENCY", "Emergency (Immediate)"

    class ComplaintStatus(models.TextChoices):
        OPEN = "OPEN", "Open / Reported"
        ASSIGNED = "ASSIGNED", "Assigned to Technician"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        WAITING = "WAITING", "Waiting on Parts"
        RESOLVED = "RESOLVED", "Resolved"
        CLOSED = "CLOSED", "Confirmed & Closed by Tenant"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.CharField(max_length=30, unique=True, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="complaints")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="complaints")
    tenancy = models.ForeignKey(Tenancy, on_delete=models.CASCADE, related_name="complaints")

    category = models.CharField(max_length=30, choices=ComplaintCategory.choices)
    urgency = models.CharField(max_length=20, choices=Urgency.choices, default=Urgency.MEDIUM)
    title = models.CharField(max_length=200)
    description = models.TextField()
    photo = models.ImageField(upload_to="complaints/%Y/%m/", null=True, blank=True)
    status = models.CharField(max_length=20, choices=ComplaintStatus.choices, default=ComplaintStatus.OPEN, db_index=True)

    assigned_staff = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_complaints")
    resolution_notes = models.TextField(blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = f"TCK-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_number} - {self.title} [{self.get_status_display()}]"

class MaintenanceTicket(models.Model):
    complaint = models.OneToOneField(Complaint, on_delete=models.CASCADE, related_name="maintenance_record")
    vendor_name = models.CharField(max_length=150, blank=True)
    vendor_phone = models.CharField(max_length=15, blank=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    invoice_document = models.FileField(upload_to="maintenance_bills/%Y/%m/", null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Maintenance for {self.complaint.ticket_number} - Cost: ₹{self.actual_cost}"
