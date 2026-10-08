from apps.access import ScopedModelSerializer
from rest_framework import serializers
from apps.bookings.models import Booking

class BookingSerializer(ScopedModelSerializer):
    property_title = serializers.CharField(source="property.title", read_only=True)
    room_number = serializers.CharField(source="room.room_number", read_only=True)
    bed_identifier = serializers.CharField(source="bed.bed_identifier", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_reference",
            "organization",
            "property",
            "property_title",
            "room",
            "room_number",
            "bed",
            "bed_identifier",
            "user",
            "tenant_name",
            "tenant_phone",
            "tenant_email",
            "move_in_date",
            "token_amount",
            "monthly_rent",
            "security_deposit",
            "status",
            "special_requests",
            "expires_at",
            "created_at",
        ]
        read_only_fields = ["id", "booking_reference", "created_at"]
