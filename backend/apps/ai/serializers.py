from rest_framework import serializers
from apps.ai.models import AIConversation, AIMessage, AIAction

class AIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIMessage
        fields = ["id", "sender", "content", "tool_invocations", "created_at"]

class AIActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAction
        fields = ["id", "action_type", "preview_summary", "payload", "status", "created_at"]

class AIConversationSerializer(serializers.ModelSerializer):
    messages = AIMessageSerializer(many=True, read_only=True)
    actions = AIActionSerializer(many=True, read_only=True)

    class Meta:
        model = AIConversation
        fields = ["id", "title", "messages", "actions", "created_at"]
