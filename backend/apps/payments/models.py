import uuid
from django.db import models
from apps.organizations.models import Organization
from apps.tenants.models import Tenancy
from apps.billing.models import Invoice
from apps.bookings.models import Booking

class Payment(models.Model):
    class PaymentType(models.TextChoices):
        RENT = "RENT", "Monthly Rent"
        TOKEN = "TOKEN", "Booking Token"
        SECURITY_DEPOSIT = "SECURITY_DEPOSIT", "Security Deposit"
        MAINTENANCE = "MAINTENANCE", "Maintenance"
        UTILITY = "UTILITY", "Utility Bill"
        MESS = "MESS", "Mess / Food"
        AGREEMENT_FEE = "AGREEMENT_FEE", "Agreement & Stamping Fee"
        OTHER = "OTHER", "Other Charges"

    class PaymentMethod(models.TextChoices):
        UPI = "UPI", "UPI (PhonePe, GPay, Paytm)"
        DEBIT_CARD = "DEBIT_CARD", "Debit Card"
        CREDIT_CARD = "CREDIT_CARD", "Credit Card"
        NETBANKING = "NETBANKING", "Net Banking"
        CASH = "CASH", "Cash / Offline"

    class PaymentStatus(models.TextChoices):
        CREATED = "CREATED", "Order Created"
        PENDING = "PENDING", "Pending Confirmation"
        SUCCESS = "SUCCESS", "Payment Successful"
        FAILED = "FAILED", "Payment Failed"
        REFUNDED = "REFUNDED", "Refunded"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    receipt_number = models.CharField(max_length=50, unique=True, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="payments")
    tenancy = models.ForeignKey(Tenancy, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=30, choices=PaymentType.choices, default=PaymentType.RENT)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.UPI)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.CREATED, db_index=True)

    # Gateway identifiers
    gateway_name = models.CharField(max_length=50, default="RAZORPAY")
    gateway_order_id = models.CharField(max_length=150, blank=True, db_index=True)
    gateway_payment_id = models.CharField(max_length=150, blank=True, db_index=True)
    gateway_signature = models.CharField(max_length=255, blank=True)

    # Safety & Audit
    is_reconciled = models.BooleanField(default=False)
    reconciled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            self.receipt_number = f"REC-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.receipt_number} - ₹{self.amount} [{self.get_status_display()}]"

class PaymentAttempt(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="attempts")
    provider_event_id = models.CharField(max_length=150, unique=True, blank=True, null=True, help_text="Webhook Idempotency ID")
    raw_payload = models.JSONField(default=dict)
    response_code = models.CharField(max_length=50, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attempt for {self.payment.receipt_number} @ {self.created_at}"
