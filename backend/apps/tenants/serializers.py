from apps.access import ScopedModelSerializer
from rest_framework import serializers
from apps.tenants.models import Tenancy, MoveIn, MoveOut
from apps.accounts.serializers import UserSerializer
from apps.properties.serializers import PropertySerializer, RoomSerializer, BedSerializer

class MoveInSerializer(ScopedModelSerializer):
    class Meta:
        model = MoveIn
        fields = "__all__"

class MoveOutSerializer(ScopedModelSerializer):
    class Meta:
        model = MoveOut
        fields = "__all__"

class TenancySerializer(ScopedModelSerializer):
    tenant_details = UserSerializer(source="tenant", read_only=True)
    property_title = serializers.CharField(source="property.title", read_only=True)
    property_address = serializers.CharField(source="property.address", read_only=True)
    property_city = serializers.CharField(source="property.city", read_only=True)
    room_number = serializers.CharField(source="room.room_number", read_only=True)
    bed_identifier = serializers.CharField(source="bed.bed_identifier", read_only=True)
    move_in_record = MoveInSerializer(read_only=True)
    move_out_record = MoveOutSerializer(read_only=True)

    class Meta:
        model = Tenancy
        fields = [
            "id",
            "tenant",
            "tenant_details",
            "property",
            "property_title",
            "property_address",
            "property_city",
            "room",
            "room_number",
            "bed",
            "bed_identifier",
            "start_date",
            "end_date",
            "monthly_rent",
            "security_deposit_paid",
            "status",
            "move_in_record",
            "move_out_record",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
