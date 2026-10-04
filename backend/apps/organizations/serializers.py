from rest_framework import serializers
from apps.organizations.models import Organization, OrganizationMember
from apps.accounts.serializers import UserSerializer

class OrganizationMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = OrganizationMember
        fields = ["id", "user", "role", "is_active", "joined_at"]

class OrganizationSerializer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(source="members.count", read_only=True)
    properties_count = serializers.IntegerField(source="properties.count", read_only=True)

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "slug",
            "legal_business_name",
            "gstin",
            "pan",
            "contact_email",
            "contact_phone",
            "address",
            "city",
            "state",
            "pincode",
            "logo",
            "is_active",
            "is_verified",
            "members_count",
            "properties_count",
            "created_at",
        ]
        read_only_fields = ["id", "slug", "is_verified", "created_at"]
