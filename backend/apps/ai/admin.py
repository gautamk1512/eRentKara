from django.contrib import admin
from apps.ai.models import AIConversation, AIMessage, AIAction


class AIMessageInline(admin.TabularInline):
    model = AIMessage
    extra = 0
    readonly_fields = ("created_at",)


class AIActionInline(admin.StackedInline):
    model = AIAction
    extra = 0
    readonly_fields = ("created_at", "executed_at")


@admin.register(AIConversation)
class AIConversationAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "organization", "created_at")
    search_fields = ("title", "user__email", "organization__name")
    inlines = [AIMessageInline, AIActionInline]


@admin.register(AIMessage)
class AIMessageAdmin(admin.ModelAdmin):
    list_display = ("conversation", "sender", "short_content", "created_at")
    list_filter = ("sender", "created_at")
    search_fields = ("content", "conversation__title", "conversation__user__email")

    def short_content(self, obj):
        return obj.content[:80] + ("..." if len(obj.content) > 80 else "")


@admin.register(AIAction)
class AIActionAdmin(admin.ModelAdmin):
    list_display = ("action_type", "conversation", "status", "executed_at", "created_at")
    list_filter = ("action_type", "status", "created_at")
    search_fields = ("preview_summary", "conversation__title")
    readonly_fields = ("created_at", "executed_at")
