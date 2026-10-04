import uuid
from django.db import models
from apps.accounts.models import User
from apps.organizations.models import Organization

class Notification(models.Model):
    class NotificationCategory(models.TextChoices):
        RENT = "RENT", "Rent & Invoicing"
        PAYMENT = "PAYMENT", "Payment Confirmation"
        BOOKING = "BOOKING", "Booking Update"
        AGREEMENT = "AGREEMENT", "Agreement & eSign"
        KYC = "KYC", "KYC Verification"
        COMPLAINT = "COMPLAINT", "Complaint Update"
        VISITOR = "VISITOR", "Visitor Arrival"
        SYSTEM = "SYSTEM", "System Alert"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    category = models.CharField(max_length=20, choices=NotificationCategory.choices, default=NotificationCategory.SYSTEM)
    title = models.CharField(max_length=200)
    message = models.TextField()
    action_url = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.title} [{'Read' if self.is_read else 'Unread'}]"

class CommunicationLog(models.Model):
    class Channel(models.TextChoices):
        WHATSAPP = "WHATSAPP", "WhatsApp Official API"
        EMAIL = "EMAIL", "Transactional Email"
        SMS = "SMS", "SMS"
        IN_APP = "IN_APP", "In-App Notification"

    class Status(models.TextChoices):
        QUEUED = "QUEUED", "Queued"
        SENT = "SENT", "Sent to Gateway"
        DELIVERED = "DELIVERED", "Delivered"
        READ = "READ", "Read by Recipient"
        FAILED = "FAILED", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True, related_name="communication_logs")
    recipient = models.CharField(max_length=150, help_text="Phone number or email address")
    channel = models.CharField(max_length=20, choices=Channel.choices)
    template_name = models.CharField(max_length=100, blank=True)
    message_content = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.QUEUED)
    provider_message_id = models.CharField(max_length=150, blank=True)
    failure_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.channel} to {self.recipient} [{self.get_status_display()}]"
