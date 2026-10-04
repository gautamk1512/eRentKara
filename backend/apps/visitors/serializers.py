from rest_framework import serializers
from apps.visitors.models import Visitor

class VisitorSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenancy.tenant.get_full_name", read_only=True)
    room_number = serializers.CharField(source="tenancy.room.room_number", read_only=True)

    class Meta:
        model = Visitor
        fields = [
            "id",
            "tenancy",
            "tenant_name",
            "room_number",
            "visitor_name",
            "visitor_phone",
            "relation",
            "purpose",
            "expected_arrival",
            "check_in_time",
            "check_out_time",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
