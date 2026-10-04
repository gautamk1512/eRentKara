from rest_framework import serializers
from apps.complaints.models import Complaint, MaintenanceTicket

class MaintenanceTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceTicket
        fields = "__all__"

class ComplaintSerializer(serializers.ModelSerializer):
    maintenance_record = MaintenanceTicketSerializer(read_only=True)
    tenant_name = serializers.CharField(source="tenancy.tenant.get_full_name", read_only=True)
    property_title = serializers.CharField(source="property.title", read_only=True)
    room_number = serializers.CharField(source="tenancy.room.room_number", read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id",
            "ticket_number",
            "organization",
            "property",
            "property_title",
            "tenancy",
            "tenant_name",
            "room_number",
            "category",
            "urgency",
            "title",
            "description",
            "photo",
            "status",
            "assigned_staff",
            "resolution_notes",
            "resolved_at",
            "maintenance_record",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "ticket_number", "created_at", "updated_at"]
