# 🏗️ Model Architecture & Domain Invariants

This technical document details the **Django ORM Model Architecture**, business logic invariants, field constraints, state machine transitions, and concurrency guarantees implemented across the 22 modular applications of **eRentKarar**.

---

## 🧩 Architectural Principles

1. **Modular Monolith**: Clean separation of bounded contexts (`accounts`, `properties`, `billing`, `agreements`, etc.) with explicit foreign key boundaries.
2. **Deterministic State Machines**: Transition validation prevents illegal lifecycle jumps (e.g. an agreement cannot be `COMPLETED` without all required e-signatures).
3. **Pessimistic Concurrency**: Atomic transaction locking on shared resources (`Bed.objects.select_for_update()`).
4. **Audit Trail Immutability**: Critical legal documents and financial transactions enforce soft-delete or delete protection (`on_delete=models.PROTECT`).

---

## 📊 Comprehensive Model Catalog by App

### 1. `apps.accounts` — User & Role Management
```python
class UserRole(models.TextChoices):
    OWNER = "OWNER", "Property Owner / Landlord"
    TENANT = "TENANT", "Resident / Tenant"
    STAFF = "STAFF", "Property Staff / Manager"
    KIOSK = "KIOSK", "Kiosk / Documentation Partner"
    ADMIN = "ADMIN", "Super Administrator"

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=15, unique=True, db_index=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.TENANT)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    preferred_language = models.CharField(max_length=10, default="en")
    created_at = models.DateTimeField(auto_now_add=True)
```

---

### 2. `apps.properties` — Property & 5-Tier Inventory Hierarchy

```python
class PropertyType(models.TextChoices):
    PG = "PG", "PG / Hostel"
    CO_LIVING = "CO_LIVING", "Co-Living Space"
    FLAT = "FLAT", "Apartment / Flat"
    COMMERCIAL = "COMMERCIAL", "Commercial Office / Shop"
    ROOM = "ROOM", "Private Room"

class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey("organizations.Organization", on_delete=models.CASCADE, related_name="properties")
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    property_type = models.CharField(max_length=30, choices=PropertyType.choices, default=PropertyType.PG)
    address = models.TextField()
    locality = models.CharField(max_length=100, db_index=True)
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    monthly_rent_starting = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit_default = models.DecimalField(max_digits=10, decimal_places=2)
    gender_preference = models.CharField(max_length=20, default="ANY")
    food_included = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True, db_index=True)
    verification_status = models.CharField(max_length=20, default="VERIFIED")

class Room(models.Model):
    floor = models.ForeignKey("Floor", on_delete=models.CASCADE, related_name="rooms")
    room_number = models.CharField(max_length=50)
    occupancy_type = models.CharField(max_length=30, default="DOUBLE")
    is_air_conditioned = models.BooleanField(default=False)
    electricity_sub_meter_number = models.CharField(max_length=50, null=True, blank=True)

class Bed(models.Model):
    class BedStatus(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        RESERVED = "RESERVED", "Reserved / Token Locked"
        OCCUPIED = "OCCUPIED", "Occupied"
        MAINTENANCE = "MAINTENANCE", "Under Maintenance"

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="beds")
    bed_number = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=BedStatus.choices, default=BedStatus.AVAILABLE, db_index=True)
    base_monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
```

---

### 3. `apps.agreements` — Legal Tenancy Deed & e-Stamping

```python
class AgreementStatus(models.TextChoices):
    DRAFT = "DRAFT", "Drafting in Progress"
    INVITED = "INVITED", "Counterparty Invited"
    AWAITING_ESIGN = "AWAITING_ESIGN", "Awaiting Aadhaar eSign"
    COMPLETED = "COMPLETED", "Executed & Legally Enforceable"
    CANCELLED = "CANCELLED", "Cancelled"

class RentalAgreement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement_number = models.CharField(max_length=50, unique=True, db_index=True)
    landlord = models.ForeignKey("accounts.User", on_delete=models.PROTECT, related_name="landlord_agreements")
    tenant = models.ForeignKey("accounts.User", on_delete=models.PROTECT, related_name="tenant_agreements")
    property = models.ForeignKey("properties.Property", on_delete=models.SET_NULL, null=True, blank=True)
    
    agreement_type = models.CharField(max_length=30, default="RESIDENTIAL")
    duration_months = models.IntegerField(default=11)
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2)
    escalation_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    
    state_code = models.CharField(max_length=5, default="GJ")
    stamp_duty_amount = models.DecimalField(max_digits=10, decimal_places=2, default=300.0)
    stamp_certificate_number = models.CharField(max_length=100, null=True, blank=True)
    
    status = models.CharField(max_length=30, choices=AgreementStatus.choices, default=AgreementStatus.DRAFT, db_index=True)
    pdf_document = models.FileField(upload_to="agreements/pdf/%Y/%m/", null=True, blank=True)
    qr_verification_hash = models.CharField(max_length=64, null=True, blank=True)
    
    landlord_signed_at = models.DateTimeField(null=True, blank=True)
    tenant_signed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

### 4. `apps.billing` & `apps.payments` — Invoicing & Sub-Meter Calculations

```python
class InvoiceStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    ISSUED = "ISSUED", "Issued to Tenant"
    PAID = "PAID", "Fully Paid"
    PARTIALLY_PAID = "PARTIALLY_PAID", "Partially Paid"
    OVERDUE = "OVERDUE", "Payment Overdue"

class Invoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenancy = models.ForeignKey("tenants.Tenancy", on_delete=models.PROTECT, related_name="invoices")
    invoice_number = models.CharField(max_length=50, unique=True, db_index=True)
    
    billing_period_start = models.DateField()
    billing_period_end = models.DateField()
    due_date = models.DateField()
    
    base_rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    electricity_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    maintenance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    total_due = models.DecimalField(max_digits=10, decimal_places=2)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, choices=InvoiceStatus.choices, default=InvoiceStatus.ISSUED, db_index=True)

class MeterReading(models.Model):
    room = models.ForeignKey("properties.Room", on_delete=models.CASCADE, related_name="meter_readings")
    reading_date = models.DateField()
    previous_units = models.DecimalField(max_digits=10, decimal_places=2)
    current_units = models.DecimalField(max_digits=10, decimal_places=2)
    rate_per_unit = models.DecimalField(max_digits=6, decimal_places=2, default=9.50)
    
    @property
    def units_consumed(self):
        return max(self.current_units - self.previous_units, Decimal("0.0"))
        
    @property
    def total_electricity_cost(self):
        return self.units_consumed * self.rate_per_unit
```

---

## 🔄 State Machine Transitions

```
[ Booking State Machine ]
AVAILABLE ──(Select & Lock)──► RESERVED ──(₹1,000 Token Paid)──► CONFIRMED ──(Check-in)──► OCCUPIED
    ▲                             │
    └────────(15-min Expiry)──────┘

[ Rental Agreement State Machine ]
DRAFT ──(Invite Tenant)──► INVITED ──(Both Verified)──► AWAITING_ESIGN ──(Aadhaar OTP)──► COMPLETED

[ Monthly Invoice State Machine ]
DRAFT ──(Meter Calculated)──► ISSUED ──(Partial Payment)──► PARTIALLY_PAID ──(Full Settle)──► PAID
                                 │
                                 └───(Past Due Date)───────► OVERDUE
```
