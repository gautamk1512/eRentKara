from django.contrib import admin
from apps.audit.models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "user", "action", "entity_name", "entity_id", "ip_address")
    list_filter = ("action", "entity_name", "timestamp")
    search_fields = ("user__email", "action", "entity_name", "entity_id", "ip_address")
    readonly_fields = ("id", "user", "organization", "action", "entity_name", "entity_id", "ip_address", "user_agent", "details", "timestamp")
