from apps.access import ScopedModelSerializer
from rest_framework import serializers
from apps.leads.models import Lead, LeadActivity, Visit

class LeadActivitySerializer(ScopedModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = LeadActivity
        fields = ["id", "lead", "user", "user_email", "activity_type", "note", "created_at"]
        read_only_fields = ["id", "created_at"]

class VisitSerializer(ScopedModelSerializer):
    lead_name = serializers.CharField(source="lead.name", read_only=True)
    lead_phone = serializers.CharField(source="lead.phone", read_only=True)
    property_title = serializers.CharField(source="property.title", read_only=True)

    class Meta:
        model = Visit
        fields = [
            "id",
            "lead",
            "lead_name",
            "lead_phone",
            "property",
            "property_title",
            "scheduled_at",
            "status",
            "assigned_staff",
            "feedback",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

class LeadSerializer(ScopedModelSerializer):
    property_title = serializers.CharField(source="property.title", read_only=True)
    activities = LeadActivitySerializer(many=True, read_only=True)
    visits = VisitSerializer(many=True, read_only=True)

    class Meta:
        model = Lead
        fields = [
            "id",
            "organization",
            "property",
            "property_title",
            "name",
            "phone",
            "email",
            "source",
            "budget",
            "preferred_location",
            "gender",
            "move_in_date",
            "status",
            "assigned_staff",
            "notes",
            "activities",
            "visits",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
