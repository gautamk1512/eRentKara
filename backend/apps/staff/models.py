import uuid
from django.db import models
from apps.organizations.models import Organization
from apps.accounts.models import User
from apps.properties.models import Property

class Staff(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="staff_members")
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="staff_profile")
    designation = models.CharField(max_length=100, help_text="e.g. Property Manager, Caretaker, Electrician")
    assigned_properties = models.ManyToManyField(Property, blank=True, related_name="staff")
    monthly_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    shift_timings = models.CharField(max_length=100, default="09:00 AM - 06:00 PM")
    is_active = models.BooleanField(default=True)
    joined_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} ({self.designation}) @ {self.organization.name}"
