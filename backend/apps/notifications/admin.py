from django.contrib import admin
from apps.notifications.models import Notification, CommunicationLog


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "category", "title", "is_read", "created_at")
    list_filter = ("category", "is_read", "created_at")
    search_fields = ("user__email", "title", "message")


@admin.register(CommunicationLog)
class CommunicationLogAdmin(admin.ModelAdmin):
    list_display = ("channel", "recipient", "organization", "template_name", "status", "created_at")
    list_filter = ("channel", "status", "created_at")
    search_fields = ("recipient", "template_name", "message_content", "provider_message_id")
