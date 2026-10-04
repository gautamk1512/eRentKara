import uuid
from django.db import models
from apps.organizations.models import Organization
from apps.properties.models import Property, Room, Bed
from apps.accounts.models import User

class Booking(models.Model):
    class BookingStatus(models.TextChoices):
        PENDING = "PENDING", "Pending Token Payment"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"
        EXPIRED = "EXPIRED", "Expired"
        CHECKED_IN = "CHECKED_IN", "Checked In"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_reference = models.CharField(max_length=20, unique=True, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="bookings")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="bookings")
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")
    bed = models.ForeignKey(Bed, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")

    # Tenant Details
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")
    tenant_name = models.CharField(max_length=150)
    tenant_phone = models.CharField(max_length=15)
    tenant_email = models.EmailField()

    move_in_date = models.DateField()
    token_amount = models.DecimalField(max_digits=10, decimal_places=2, default=1000.0)
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING, db_index=True)
    special_requests = models.TextField(blank=True)

    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = f"ERK-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_reference} - {self.tenant_name} ({self.get_status_display()})"
