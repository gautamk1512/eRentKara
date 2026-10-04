from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline
from unfold.decorators import display
from apps.accounts.models import User, UserProfile


class UserProfileInline(StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "User Profile"
    fk_name = "user"
    fields = (
        "full_name",
        "aadhaar_masked",
        "pan_number",
        "preferred_city",
        "permanent_address",
        "emergency_contact_name",
        "emergency_contact_phone",
        "notification_whatsapp",
        "notification_email",
    )


@admin.register(User)
class UserAdmin(ModelAdmin):
    inlines = (UserProfileInline,)
    list_display = (
        "email",
        "first_name",
        "last_name",
        "show_role",
        "show_verified",
        "is_staff",
        "created_at",
    )
    list_filter = ("role", "is_verified", "is_staff", "is_superuser", "created_at")
    search_fields = ("email", "first_name", "last_name", "phone_number", "google_id")
    ordering = ("-created_at",)
    list_filter_submit = True

    @display(
        description="Role",
        label={
            User.RoleChoices.SUPER_ADMIN: "danger",
            User.RoleChoices.ADMIN: "danger",
            User.RoleChoices.OWNER: "success",
            User.RoleChoices.TENANT: "info",
            User.RoleChoices.PROPERTY_MANAGER: "warning",
            User.RoleChoices.SHOP_ADMIN: "warning",
            User.RoleChoices.SHOP_OPERATOR: "warning",
        }
    )
    def show_role(self, obj):
        return obj.get_role_display()

    @display(
        description="Verified",
        label={
            True: "success",
            False: "warning",
        }
    )
    def show_verified(self, obj):
        return "Verified" if obj.is_verified else "Unverified"

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone_number",
                    "role",
                    "avatar",
                    "google_id",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_verified",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )

    readonly_fields = ("created_at", "updated_at")


@admin.register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = (
        "user",
        "full_name",
        "aadhaar_masked",
        "pan_number",
        "preferred_city",
        "notification_whatsapp",
    )
    search_fields = ("user__email", "full_name", "aadhaar_masked", "pan_number")
    list_filter = ("preferred_city", "notification_whatsapp")
