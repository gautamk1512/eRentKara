import uuid
from django.db import models
from apps.accounts.models import User
from apps.organizations.models import Organization

class AIConversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ai_conversations")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="ai_conversations")
    title = models.CharField(max_length=200, default="New Conversation")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.email}"

class AIMessage(models.Model):
    class Sender(models.TextChoices):
        USER = "USER", "User"
        ASSISTANT = "ASSISTANT", "Ekrar AI Assistant"
        SYSTEM = "SYSTEM", "System"

    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=15, choices=Sender.choices)
    content = models.TextField()
    tool_invocations = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:40]}..."

class AIAction(models.Model):
    class ActionType(models.TextChoices):
        RENT_REMINDER = "RENT_REMINDER", "Send Rent WhatsApp Reminders"
        NOTICE_DISPATCH = "NOTICE_DISPATCH", "Send Expiry Notice"
        GENERATE_INVOICES = "GENERATE_INVOICES", "Bulk Generate Monthly Invoices"
        MARK_VACANT = "MARK_VACANT", "Update Bed Availability"

    class ActionStatus(models.TextChoices):
        PREPARED = "PREPARED", "Prepared & Awaiting User Confirmation"
        CONFIRMED = "CONFIRMED", "Confirmed & Executed"
        CANCELLED = "CANCELLED", "Cancelled by User"
        FAILED = "FAILED", "Execution Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name="actions")
    action_type = models.CharField(max_length=30, choices=ActionType.choices)
    preview_summary = models.TextField(help_text="Detailed preview shown to user before asking confirmation")
    payload = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=ActionStatus.choices, default=ActionStatus.PREPARED)
    executed_at = models.DateTimeField(null=True, blank=True)
    execution_result = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_action_type_display()} [{self.get_status_display()}]"
