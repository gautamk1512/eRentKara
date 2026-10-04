import uuid
from django.db import models
from apps.tenants.models import Tenancy

class SecurityDeposit(models.Model):
    class DepositStatus(models.TextChoices):
        PENDING = "PENDING", "Pending Collection"
        HELD = "HELD", "Held in Escrow / Ledger"
        PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED", "Partially Refunded"
        SETTLED = "SETTLED", "Fully Settled & Closed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenancy = models.OneToOneField(Tenancy, on_delete=models.CASCADE, related_name="deposit_record")
    amount_total = models.DecimalField(max_digits=10, decimal_places=2)
    amount_collected = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=25, choices=DepositStatus.choices, default=DepositStatus.PENDING)
    collected_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Deposit for {self.tenancy} - ₹{self.amount_collected}/₹{self.amount_total}"

class DepositSettlement(models.Model):
    deposit = models.OneToOneField(SecurityDeposit, on_delete=models.CASCADE, related_name="settlement")
    damages_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    unpaid_rent_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    utility_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    other_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
    refund_transaction_reference = models.CharField(max_length=100, blank=True)
    settlement_date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Settlement for {self.deposit.tenancy}: Refund ₹{self.refund_amount}"
