import uuid
from django.db import models
from apps.tenants.models import Tenancy
from apps.properties.models import Property, Room

class Invoice(models.Model):
    class InvoiceStatus(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ISSUED = "ISSUED", "Issued / Pending Payment"
        PARTIALLY_PAID = "PARTIALLY_PAID", "Partially Paid"
        PAID = "PAID", "Paid"
        OVERDUE = "OVERDUE", "Overdue"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=50, unique=True, editable=False)
    tenancy = models.ForeignKey(Tenancy, on_delete=models.CASCADE, related_name="invoices")
    billing_month = models.IntegerField(help_text="Month number 1-12")
    billing_year = models.IntegerField(default=2026)

    # Itemized Breakdown
    base_rent = models.DecimalField(max_digits=10, decimal_places=2)
    maintenance_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    electricity_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    water_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    mess_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    late_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    adjustments_or_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=InvoiceStatus.choices, default=InvoiceStatus.ISSUED, db_index=True)

    pdf_receipt = models.FileField(upload_to="invoices/receipts/%Y/%m/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = f"INV-{self.billing_year}{self.billing_month:02d}-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    @property
    def pending_amount(self):
        return max(0.0, float(self.total_amount) - float(self.paid_amount))

    def __str__(self):
        return f"{self.invoice_number} - ₹{self.total_amount} ({self.get_status_display()})"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    title = models.CharField(max_length=150)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, default="RENT")

    def __str__(self):
        return f"{self.title}: ₹{self.amount}"

class ElectricityReading(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="electricity_readings")
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name="electricity_readings")
    meter_number = models.CharField(max_length=50)
    previous_reading = models.DecimalField(max_digits=8, decimal_places=2)
    current_reading = models.DecimalField(max_digits=8, decimal_places=2)
    rate_per_unit = models.DecimalField(max_digits=6, decimal_places=2, default=10.0, help_text="INR per kWh unit")
    reading_date = models.DateField()
    reading_image = models.ImageField(upload_to="meter_photos/%Y/%m/", null=True, blank=True)

    def get_units_consumed(self):
        return max(0.0, float(self.current_reading) - float(self.previous_reading))

    def get_total_cost(self):
        return self.get_units_consumed() * float(self.rate_per_unit)

    def __str__(self):
        return f"Meter {self.meter_number} - {self.get_units_consumed()} units (₹{self.get_total_cost():.2f})"
