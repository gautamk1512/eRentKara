import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_("The Email field must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "SUPER_ADMIN")

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", _("Super Administrator")
        ADMIN = "ADMIN", _("Administrator")
        SHOP_ADMIN = "SHOP_ADMIN", _("Shop Administrator")
        SHOP_OPERATOR = "SHOP_OPERATOR", _("Shop Operator")
        OWNER = "OWNER", _("Property Owner / Landlord")
        PROPERTY_MANAGER = "PROPERTY_MANAGER", _("Property Manager")
        ACCOUNTANT = "ACCOUNTANT", _("Accountant")
        RECEPTIONIST = "RECEPTIONIST", _("Receptionist")
        SALES_EXECUTIVE = "SALES_EXECUTIVE", _("Sales Executive")
        MAINTENANCE_STAFF = "MAINTENANCE_STAFF", _("Maintenance Staff")
        HOUSEKEEPING = "HOUSEKEEPING", _("Housekeeping")
        TENANT = "TENANT", _("Tenant")
        MESS_MANAGER = "MESS_MANAGER", _("Mess Manager")
        SECURITY = "SECURITY", _("Security Guard")

    username = None  # Use email as unique identifier
    email = models.EmailField(_("Email Address"), unique=True)
    phone_number = models.CharField(_("Phone Number"), max_length=15, unique=True, null=True, blank=True)
    role = models.CharField(_("Primary Role"), max_length=30, choices=RoleChoices.choices, default=RoleChoices.TENANT)
    is_verified = models.BooleanField(_("Verified User"), default=False)
    google_id = models.CharField(_("Google OAuth ID"), max_length=255, null=True, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=150, blank=True)
    aadhaar_masked = models.CharField(max_length=12, blank=True, help_text="Last 4 digits: XXXX-XXXX-1234")
    pan_number = models.CharField(max_length=10, blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    permanent_address = models.TextField(blank=True)
    preferred_city = models.CharField(max_length=100, default="Bengaluru", blank=True)
    notification_whatsapp = models.BooleanField(default=True)
    notification_email = models.BooleanField(default=True)
    notification_sms = models.BooleanField(default=False)

    def __str__(self):
        return f"Profile for {self.user.email}"
