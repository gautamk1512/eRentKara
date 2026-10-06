from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline
from unfold.decorators import display
from apps.accounts.models import User, UserProfile
from apps.accounts.models import PartnerApplication, ContactRequest
from django.core.exceptions import ValidationError
from django.contrib import messages
from django.utils import timezone
from .partner_onboarding import approve_partner, send_partner_invitation


@admin.register(PartnerApplication)
class PartnerApplicationAdmin(ModelAdmin):
    list_display = ("business_name", "full_name", "city", "profession", "status", "invitation_sent_at", "activated_at")
    list_filter = ("status", "city", "profession")
    search_fields = ("full_name", "email", "business_name", "city", "registration_number")
    readonly_fields = ("partner_id", "full_name", "email", "phone", "business_name", "city", "state", "profession", "registration_number", "address", "experience", "consent", "status", "user", "reviewed_by", "reviewed_at", "invitation_sent_at", "invitation_error", "activated_at", "created_at")
    actions = ("approve_applications", "reject_applications", "resend_invitation")
    list_filter_submit = True

    def has_add_permission(self, request):
        return False

    @admin.action(description="Approve selected applications and email activation link", permissions=["change"])
    def approve_applications(self, request, queryset):
        for application in queryset:
            try:
                sent = approve_partner(application.pk, request.user)
                self.message_user(request, f"{application.email}: approved. " + ("Invitation sent." if sent else "Email failed; use Resend invitation after fixing email settings."), messages.SUCCESS if sent else messages.WARNING)
            except ValidationError as error:
                self.message_user(request, f"{application.email}: {' '.join(error.messages)}", messages.ERROR)

    @admin.action(description="Reject selected pending applications", permissions=["change"])
    def reject_applications(self, request, queryset):
        count = queryset.filter(status="PENDING").update(status="REJECTED", reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, f"{count} pending application(s) rejected.")

    @admin.action(description="Resend activation invitation", permissions=["change"])
    def resend_invitation(self, request, queryset):
        for application in queryset.select_related("user"):
            try:
                sent = send_partner_invitation(application)
                self.message_user(request, f"{application.email}: " + ("invitation sent." if sent else "delivery failed; check email configuration."), messages.SUCCESS if sent else messages.ERROR)
            except ValidationError as error:
                self.message_user(request, " ".join(error.messages), messages.ERROR)


@admin.register(ContactRequest)
class ContactRequestAdmin(ModelAdmin):
    list_display = ("name", "email", "product", "subject", "status", "created_at")
    list_filter = ("product", "status", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "phone", "product", "subject", "message", "created_at")
    list_filter_submit = True


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

    def save_model(self, request, obj, form, change):
        from django.contrib.auth.hashers import identify_hasher
        if "password" in form.changed_data:
            try:
                identify_hasher(obj.password)
            except ValueError:
                obj.set_password(obj.password)
        super().save_model(request, obj, form, change)

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
