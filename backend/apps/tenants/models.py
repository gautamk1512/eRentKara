import uuid
from django.db import models
from apps.accounts.models import User
from apps.properties.models import Property, Room, Bed

class Tenancy(models.Model):
    class TenancyStatus(models.TextChoices):
        PENDING = "PENDING", "Pending Onboarding"
        ACTIVE = "ACTIVE", "Active Stay"
        NOTICE = "NOTICE", "Under Notice Period"
        VACATED = "VACATED", "Vacated & Settled"
        TERMINATED = "TERMINATED", "Terminated"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tenancies")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="tenancies")
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name="tenancies")
    bed = models.ForeignKey(Bed, on_delete=models.SET_NULL, null=True, blank=True, related_name="tenancies")

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, choices=TenancyStatus.choices, default=TenancyStatus.PENDING, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tenant.email} @ {self.property.title} ({self.get_status_display()})"

class MoveIn(models.Model):
    tenancy = models.OneToOneField(Tenancy, on_delete=models.CASCADE, related_name="move_in_record")
    actual_move_in_date = models.DateField()
    meter_reading_electricity = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    keys_handed_over = models.BooleanField(default=True)
    room_condition_notes = models.TextField(blank=True)
    verified_by_staff = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Move-in for {self.tenancy}"

class MoveOut(models.Model):
    class MoveOutStatus(models.TextChoices):
        REQUESTED = "REQUESTED", "Move-out Requested"
        INSPECTION_PENDING = "INSPECTION_PENDING", "Inspection Pending"
        SETTLEMENT_PENDING = "SETTLEMENT_PENDING", "Settlement Pending"
        COMPLETED = "COMPLETED", "Completed & Refunded"

    tenancy = models.OneToOneField(Tenancy, on_delete=models.CASCADE, related_name="move_out_record")
    notice_date = models.DateField()
    expected_vacate_date = models.DateField()
    actual_vacate_date = models.DateField(null=True, blank=True)
    final_meter_reading = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    damages_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    unpaid_dues_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    final_refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=25, choices=MoveOutStatus.choices, default=MoveOutStatus.REQUESTED)
    settlement_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Move-out for {self.tenancy} - {self.get_status_display()}"
