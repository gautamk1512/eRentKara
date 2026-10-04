from rest_framework import serializers
from apps.organizations.models import Organization
from apps.properties.models import Property, PropertyImage, PropertyAmenity, Building, Floor, Room, Bed

class PropertyAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyAmenity
        fields = ["id", "name", "icon", "category"]

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image", "image_url", "is_cover", "caption"]

class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = ["id", "room", "bed_identifier", "rent_amount", "deposit_amount", "status"]

class RoomSerializer(serializers.ModelSerializer):
    beds = BedSerializer(many=True, read_only=True)
    available_beds_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            "id",
            "floor",
            "room_number",
            "room_type",
            "furnishing",
            "base_rent",
            "default_deposit",
            "has_attached_bathroom",
            "has_ac",
            "has_balcony",
            "is_active",
            "beds",
            "available_beds_count",
        ]

    def get_available_beds_count(self, obj):
        # In-memory evaluation using prefetched cache (eliminates N+1 DB queries)
        return sum(1 for b in obj.beds.all() if b.status == Bed.BedStatus.AVAILABLE)

class FloorSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)

    class Meta:
        model = Floor
        fields = ["id", "building", "floor_number", "name", "rooms"]

class BuildingSerializer(serializers.ModelSerializer):
    floors = FloorSerializer(many=True, read_only=True)

    class Meta:
        model = Building
        fields = ["id", "property", "name", "description", "floors"]

class PropertySerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all(), required=False)
    images = PropertyImageSerializer(many=True, read_only=True)
    amenities = PropertyAmenitySerializer(many=True, read_only=True)
    buildings = BuildingSerializer(many=True, read_only=True)
    organization_name = serializers.CharField(source="organization.name", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "organization",
            "organization_name",
            "title",
            "slug",
            "property_type",
            "description",
            "address",
            "locality",
            "city",
            "state",
            "pincode",
            "latitude",
            "longitude",
            "nearby_landmarks",
            "monthly_rent_starting",
            "security_deposit",
            "maintenance_charges",
            "notice_period_days",
            "minimum_stay_months",
            "gender_preference",
            "food_included",
            "food_type",
            "electricity_policy",
            "water_policy",
            "house_rules",
            "is_published",
            "is_featured",
            "verification_status",
            "ownership_document_type",
            "electricity_consumer_number",
            "electricity_board_discom",
            "property_tax_id",
            "ownership_document_file",
            "ownership_verification_method",
            "ownership_warranty_accepted",
            "ownership_verified_at",
            "ownership_verification_notes",
            "images",
            "amenities",
            "buildings",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "verification_status",
            "ownership_verified_at",
            "created_at",
            "updated_at",
        ]
