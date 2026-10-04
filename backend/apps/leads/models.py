import uuid
from django.db import models
from apps.organizations.models import Organization
from apps.properties.models import Property
from apps.accounts.models import User

class Lead(models.Model):
    class LeadStatus(models.TextChoices):
        NEW = "NEW", "New Lead"
        CONTACTED = "CONTACTED", "Contacted"
        INTERESTED = "INTERESTED", "Interested"
        VISIT_SCHEDULED = "VISIT_SCHEDULED", "Visit Scheduled"
        VISITED = "VISITED", "Visited Property"
        NEGOTIATION = "NEGOTIATION", "In Negotiation"
        BOOKED = "BOOKED", "Booked"
        LOST = "LOST", "Lost"
        CONVERTED = "CONVERTED", "Converted to Tenant"

    class LeadSource(models.TextChoices):
        MARKETPLACE = "MARKETPLACE", "eRentKarar Marketplace"
        WEBSITE = "WEBSITE", "Direct Website"
        WHATSAPP = "WHATSAPP", "WhatsApp Enquiry"
        REFERRAL = "REFERRAL", "Referral"
        WALK_IN = "WALK_IN", "Walk-In"
        OTHER = "OTHER", "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="leads")
    property = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, blank=True, related_name="leads")
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15, db_index=True)
    email = models.EmailField(blank=True)
    source = models.CharField(max_length=30, choices=LeadSource.choices, default=LeadSource.MARKETPLACE)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    preferred_location = models.CharField(max_length=150, blank=True)
    gender = models.CharField(max_length=20, default="ANY")
    move_in_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=25, choices=LeadStatus.choices, default=LeadStatus.NEW, db_index=True)
    assigned_staff = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_leads")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.phone}) - {self.get_status_display()}"

class LeadActivity(models.Model):
    class ActivityType(models.TextChoices):
        CALL = "CALL", "Phone Call"
        WHATSAPP = "WHATSAPP", "WhatsApp Message"
        EMAIL = "EMAIL", "Email Sent"
        NOTE = "NOTE", "Internal Note"
        STATUS_CHANGE = "STATUS_CHANGE", "Status Change"

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="activities")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    activity_type = models.CharField(max_length=20, choices=ActivityType.choices, default=ActivityType.NOTE)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_activity_type_display()} for {self.lead.name}"

class Visit(models.Model):
    class VisitStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        CONFIRMED = "CONFIRMED", "Confirmed by Tenant"
        COMPLETED = "COMPLETED", "Completed"
        RESCHEDULED = "RESCHEDULED", "Rescheduled"
        CANCELLED = "CANCELLED", "Cancelled"
        NO_SHOW = "NO_SHOW", "No Show"

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="visits")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="visits")
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=VisitStatus.choices, default=VisitStatus.SCHEDULED)
    assigned_staff = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="scheduled_visits")
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Visit for {self.lead.name} at {self.property.title} ({self.scheduled_at})"
