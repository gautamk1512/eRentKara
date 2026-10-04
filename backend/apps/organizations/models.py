import uuid
from django.db import models
from django.utils.text import slugify
from apps.accounts.models import User

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    legal_business_name = models.CharField(max_length=255, blank=True)
    gstin = models.CharField(max_length=15, blank=True, null=True, help_text="Indian GST Identification Number")
    pan = models.CharField(max_length=10, blank=True, null=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, default="Bengaluru")
    state = models.CharField(max_length=100, default="Karnataka")
    pincode = models.CharField(max_length=10, default="560001")
    logo = models.ImageField(upload_to="org_logos/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Organization.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.city})"

class OrganizationMember(models.Model):
    class MemberRole(models.TextChoices):
        OWNER = "OWNER", "Owner / Founder"
        ADMIN = "ADMIN", "Administrator"
        PROPERTY_MANAGER = "PROPERTY_MANAGER", "Property Manager"
        ACCOUNTANT = "ACCOUNTANT", "Accountant"
        STAFF = "STAFF", "Operations Staff"

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=30, choices=MemberRole.choices, default=MemberRole.STAFF)
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("organization", "user")

    def __str__(self):
        return f"{self.user.email} - {self.role} @ {self.organization.name}"
