from rest_framework import serializers
from apps.accounts.models import User, UserProfile
from apps.organizations.models import Organization, OrganizationMember

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "full_name",
            "aadhaar_masked",
            "pan_number",
            "emergency_contact_name",
            "emergency_contact_phone",
            "permanent_address",
            "preferred_city",
            "notification_whatsapp",
            "notification_email",
            "notification_sms",
        ]

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    organizations = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone_number",
            "first_name",
            "last_name",
            "role",
            "is_verified",
            "google_id",
            "avatar",
            "profile",
            "organizations",
            "created_at",
        ]
        read_only_fields = ["id", "is_verified", "google_id", "created_at"]

    def get_organizations(self, obj):
        memberships = OrganizationMember.objects.filter(user=obj, is_active=True).select_related("organization")
        return [
            {
                "id": str(m.organization.id),
                "name": m.organization.name,
                "slug": m.organization.slug,
                "role": m.role,
                "city": m.organization.city,
            }
            for m in memberships
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(write_only=True, required=False, default="")
    last_name = serializers.CharField(write_only=True, required=False, default="")
    full_name = serializers.CharField(write_only=True, required=False, default="")
    phone = serializers.CharField(write_only=True, required=False, default="")
    phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    organization_name = serializers.CharField(write_only=True, required=False, default="")
    referral_code = serializers.CharField(write_only=True, required=False, default="")

    class Meta:
        model = User
        fields = [
            "email", "phone_number", "phone", "password", "role",
            "first_name", "last_name", "full_name",
            "organization_name", "referral_code"
        ]

    def validate_role(self, value):
        if value not in {"OWNER", "TENANT", "SHOP_OPERATOR"}:
            raise serializers.ValidationError("This role must be assigned by an administrator.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value.strip()).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return value.lower().strip()

    def validate(self, attrs):
        phone = attrs.get("phone") or attrs.get("phone_number")
        if phone:
            phone = str(phone).strip()
            if User.objects.filter(phone_number=phone).exists():
                raise serializers.ValidationError({"phone": "An account with this phone number already exists."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        fn = validated_data.pop("first_name", "").strip()
        ln = validated_data.pop("last_name", "").strip()
        full_name = validated_data.pop("full_name", "").strip()
        phone = validated_data.pop("phone", "").strip()
        phone_number = validated_data.get("phone_number") or phone or None
        org_name = validated_data.pop("organization_name", "").strip()
        ref_code = validated_data.pop("referral_code", "").strip()

        if not fn and full_name:
            parts = full_name.split()
            fn = parts[0]
            ln = " ".join(parts[1:]) if len(parts) > 1 else ""
        elif fn and not full_name:
            full_name = f"{fn} {ln}".strip()

        user = User.objects.create_user(
            email=validated_data["email"],
            password=password,
            phone_number=phone_number,
            role=validated_data.get("role", User.RoleChoices.TENANT),
            first_name=fn,
            last_name=ln,
        )

        UserProfile.objects.create(user=user, full_name=full_name)

        # If owner or admin and organization_name provided, create default organization
        if user.role in [User.RoleChoices.OWNER, User.RoleChoices.ADMIN] and org_name:
            org = Organization.objects.create(
                name=org_name,
                contact_email=user.email,
                contact_phone=user.phone_number or "0000000000",
            )
            OrganizationMember.objects.create(
                organization=org,
                user=user,
                role=OrganizationMember.MemberRole.OWNER,
            )

        return user
