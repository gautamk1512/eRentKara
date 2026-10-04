import uuid
from django.db import models
from apps.organizations.models import Organization

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    price_annual = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    # Limits
    max_properties = models.IntegerField(default=1)
    max_rooms = models.IntegerField(default=10)
    max_beds = models.IntegerField(default=20)
    max_staff = models.IntegerField(default=2)
    whatsapp_messages_per_month = models.IntegerField(default=100)
    ai_queries_per_month = models.IntegerField(default=50)

    # Features
    has_custom_domain = models.BooleanField(default=False)
    has_priority_support = models.BooleanField(default=False)
    has_automated_rent_collection = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} (₹{self.price_monthly}/month)"

class OrganizationSubscription(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        TRIAL = "TRIAL", "14-Day Free Trial"
        EXPIRED = "EXPIRED", "Expired"
        CANCELLED = "CANCELLED", "Cancelled"

    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name="subscription")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name="subscriptions")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TRIAL)
    starts_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    auto_renew = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.organization.name} - {self.plan.name} [{self.get_status_display()}]"
