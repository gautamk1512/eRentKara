# 🗄️ Database Architecture & Entity Relationship Diagrams (ERD)

This document provides a comprehensive technical reference for the **eRentKarar** relational database architecture, entity relationships, schema constraints, indexing strategies, and transactional concurrency guarantees.

---

## 📐 High-Level Entity Relationship Diagram (Mermaid ERD)

```mermaid
erDiagram
    %% Core Accounts & Multi-Tenancy
    USER ||--o{ ORGANIZATION_MEMBERSHIP : "belongs to"
    ORGANIZATION ||--o{ ORGANIZATION_MEMBERSHIP : "has members"
    ORGANIZATION ||--o{ PROPERTY : "owns / manages"
    ORGANIZATION ||--o{ SUBSCRIPTION : "subscribes to"

    %% Property & Inventory Hierarchy
    PROPERTY ||--o{ BUILDING : "contains"
    BUILDING ||--o{ FLOOR : "contains"
    FLOOR ||--o{ ROOM : "contains"
    ROOM ||--o{ BED : "contains"
    PROPERTY ||--o{ AMENITY : "offers"
    ROOM ||--o{ METER_READING : "tracks electricity"

    %% Marketplace & Reservations
    PROPERTY ||--o{ MARKETPLACE_LISTING : "publishes as"
    USER ||--o{ ENQUIRY : "submits"
    PROPERTY ||--o{ ENQUIRY : "receives"
    USER ||--o{ BOOKING : "books"
    BED ||--o{ BOOKING : "reserved in"

    %% Tenancy & Resident Lifecycle
    USER ||--o{ TENANCY : "resides as tenant"
    BED ||--o{ TENANCY : "assigned to"
    TENANCY ||--o{ INVOICE : "billed via"
    TENANCY ||--o{ COMPLAINT : "raises"
    TENANCY ||--o{ MEAL_RECORD : "eats / opts-out"
    TENANCY ||--o{ DEPOSIT_TRANSACTION : "holds deposit"

    %% Financials, Invoices & Payments
    INVOICE ||--o{ INVOICE_ITEM : "itemized into"
    INVOICE ||--o{ PAYMENT_TRANSACTION : "paid by"
    PAYMENT_TRANSACTION ||--o{ PAYMENT_RECEIPT : "generates"

    %% Digital Agreements & Legal e-Stamping
    USER ||--o{ RENTAL_AGREEMENT : "drafts / signs"
    PROPERTY ||--o{ RENTAL_AGREEMENT : "leased under"
    RENTAL_AGREEMENT ||--o{ AGREEMENT_PARTY : "has parties"
    RENTAL_AGREEMENT ||--o{ AGREEMENT_AUDIT_LOG : "audited by"
    RENTAL_AGREEMENT ||--o{ STAMP_PAPER_RECORD : "stamped with"

    %% KYC & Verification
    USER ||--o{ KYC_DOCUMENT : "submits identity"
    TENANCY ||--o{ POLICE_VERIFICATION : "files verification"

    %% CRM, Leads & Operations
    ORGANIZATION ||--o{ CRM_LEAD : "tracks"
    ORGANIZATION ||--o{ VISITOR_LOG : "logs"
    ORGANIZATION ||--o{ STAFF_MEMBER : "employs"
    USER ||--o{ REFERRAL_RECORD : "refers / earns"

    %% Entity Details
    USER {
        uuid id PK
        string email UK
        string phone UK
        string full_name
        string role "LANDLORD|TENANT|KIOSK|ADMIN"
        boolean is_phone_verified
        datetime created_at
    }

    ORGANIZATION {
        uuid id PK
        string name
        string slug UK
        string gstin
        string address
        string city
        string state
        string bank_account_number
        string bank_ifsc_code
        string upi_id
    }

    PROPERTY {
        uuid id PK
        uuid organization_id FK
        string title
        string slug UK
        string property_type "PG|HOSTEL|CO_LIVING|FLAT|COMMERCIAL"
        string city
        string locality
        string pincode
        decimal latitude
        decimal longitude
        decimal monthly_rent_starting
        decimal security_deposit_default
        string verification_status "PENDING|VERIFIED|REJECTED"
        boolean is_published
    }

    BED {
        bigint id PK
        bigint room_id FK
        string bed_number
        string status "AVAILABLE|RESERVED|OCCUPIED|MAINTENANCE"
        decimal base_monthly_rent
        decimal deposit_amount
    }

    BOOKING {
        uuid id PK
        bigint bed_id FK
        uuid tenant_id FK
        string booking_number UK
        string status "PENDING|TOKEN_PAID|CONFIRMED|CANCELLED"
        decimal token_amount
        datetime locked_until
        datetime check_in_date
    }

    TENANCY {
        uuid id PK
        bigint bed_id FK
        uuid tenant_id FK
        string tenancy_number UK
        string status "ACTIVE|NOTICE_SERVED|COMPLETED|TERMINATED"
        date start_date
        date end_date
        decimal agreed_monthly_rent
        decimal deposit_held
        integer notice_period_days
    }

    INVOICE {
        uuid id PK
        uuid tenancy_id FK
        string invoice_number UK
        string status "DRAFT|ISSUED|PARTIALLY_PAID|PAID|OVERDUE"
        date billing_period_start
        date billing_period_end
        date due_date
        decimal base_rent_amount
        decimal electricity_amount
        decimal maintenance_amount
        decimal total_due
        decimal total_paid
    }

    RENTAL_AGREEMENT {
        uuid id PK
        uuid landlord_id FK
        uuid tenant_id FK
        uuid property_id FK
        string agreement_number UK
        string status "DRAFT|INVITED|AWAITING_ESIGN|COMPLETED|CANCELLED"
        string agreement_type "RESIDENTIAL|COMMERCIAL"
        integer duration_months
        decimal monthly_rent
        decimal security_deposit
        string state_code
        decimal stamp_duty_amount
        string stamp_certificate_number
        string pdf_url
        string qr_verification_hash
    }
```

---

## 🏛️ Domain Schemas & Detailed Models

### 1. Accounts & Authentication (`apps.accounts`)
- **`User` (Custom AbstractUser)**:
  - `id` (UUID, Primary Key)
  - `email` (EmailField, Unique, Indexed)
  - `phone` (CharField, Unique, Indexed, max 15)
  - `full_name` (CharField, max 255)
  - `role` (CharField, Choices: `OWNER`, `TENANT`, `STAFF`, `KIOSK`, `ADMIN`)
  - `avatar` (ImageField, nullable)
  - `is_phone_verified` (BooleanField, default False)
  - `preferred_language` (CharField, `en`, `gu`, `hi`)
- **`OTPVerification`**:
  - `phone` (CharField, Indexed)
  - `otp_code` (CharField, max 6, hashed)
  - `purpose` (CharField: `LOGIN`, `ESIGN`, `PASSWORD_RESET`)
  - `expires_at` (DateTimeField)
  - `is_used` (BooleanField)

### 2. Multi-Tenant Organizations (`apps.organizations`)
- **`Organization`**:
  - `id` (UUID, Primary Key)
  - `name` (CharField, max 255)
  - `slug` (SlugField, Unique)
  - `gstin` (CharField, nullable, max 15)
  - `pan_number` (CharField, nullable, max 10)
  - `upi_id` (CharField, nullable, e.g. `landlord@icici`)
  - `bank_name`, `bank_account_number`, `bank_ifsc_code`
  - `subscription_tier` (`STARTER`, `GROWTH`, `ENTERPRISE`)
- **`OrganizationMembership`**:
  - `user_id` (FK to User)
  - `organization_id` (FK to Organization)
  - `role` (`OWNER`, `PROPERTY_MANAGER`, `ACCOUNTANT`, `WARDEN`, `RECEPTIONIST`)
  - Unique constraint on `(user_id, organization_id)`

### 3. Property & Inventory Hierarchy (`apps.properties`)
```
Property (Complex/Building Group)
  └── Building (Tower A, Tower B)
        └── Floor (1st Floor, 2nd Floor)
              └── Room (Room 101 - 2-Sharing AC)
                    └── Bed (Bed A, Bed B - Unit of Occupancy)
```
- **`Property`**:
  - `id` (UUID, PK), `organization_id` (FK)
  - `title`, `slug`, `property_type` (`PG`, `HOSTEL`, `CO_LIVING`, `FLAT`, `COMMERCIAL`, `ROOM`)
  - `address`, `locality`, `city`, `state`, `pincode`
  - `latitude`, `longitude` (DecimalField, Indexed for spatial bounding box)
  - `monthly_rent_starting`, `security_deposit_default`, `notice_period_days`
  - `gender_preference` (`MALE`, `FEMALE`, `CO_ED`, `FAMILY`)
  - `food_included` (BooleanField), `rules_and_policies` (TextField)
  - `verification_status` (`PENDING`, `VERIFIED`, `REJECTED`)
  - `is_published` (BooleanField, default True)
- **`Room`**:
  - `id` (BigAutoField), `floor_id` (FK), `room_number` (CharField)
  - `occupancy_type` (`SINGLE`, `DOUBLE`, `TRIPLE`, `FOUR_SHARING`, `ENTIRE_FLAT`)
  - `has_attached_bathroom`, `has_balcony`, `is_air_conditioned`
  - `electricity_sub_meter_number` (CharField, nullable)
- **`Bed`**:
  - `id` (BigAutoField), `room_id` (FK)
  - `bed_number` (CharField, e.g. "Bed 1", "Left Window Bed")
  - `status` (`AVAILABLE`, `RESERVED`, `OCCUPIED`, `MAINTENANCE`)
  - `base_monthly_rent`, `deposit_amount`

### 4. Concurrency & Pessimistic Locking in Bookings (`apps.bookings`)
- **`Booking`**:
  - `id` (UUID, PK), `bed_id` (FK), `tenant_id` (FK)
  - `booking_number` (CharField, Unique, e.g. `ERK-BKG-2026-8812`)
  - `status` (`PENDING`, `TOKEN_PAID`, `CONFIRMED`, `CANCELLED`, `REFUNDED`)
  - `token_amount` (DecimalField, default ₹1,000)
  - `locked_until` (DateTimeField, 15-minute checkout window)
- **Atomic Locking Guarantee**:
  ```python
  with transaction.atomic():
      bed = Bed.objects.select_for_update().get(id=bed_id)
      if bed.status != "AVAILABLE":
          raise ValidationError("Bed is already reserved or occupied.")
      bed.status = "RESERVED"
      bed.save()
      booking = Booking.objects.create(...)
  ```

### 5. Invoicing & Sub-Meter Electricity Engine (`apps.billing`)
- **`MeterReading`**:
  - `room_id` (FK), `reading_date` (DateField)
  - `previous_units`, `current_units`, `consumed_units` (Generated/Computed)
  - `rate_per_unit` (DecimalField, e.g. ₹9.50/unit)
  - `total_amount` (Computed: `consumed_units * rate_per_unit`)
- **`Invoice`**:
  - `tenancy_id` (FK), `invoice_number` (Unique, e.g. `ERK-INV-2026-1049`)
  - `billing_period_start`, `billing_period_end`, `due_date`
  - `base_rent_amount`, `electricity_amount`, `maintenance_amount`, `discount_amount`
  - `total_due`, `total_paid`, `balance_remaining`
  - `status` (`DRAFT`, `ISSUED`, `PAID`, `PARTIALLY_PAID`, `OVERDUE`)

### 6. Digital Rental Agreements & Legal e-Stamping (`apps.agreements`)
- **`RentalAgreement`**:
  - `landlord_id` (FK), `tenant_id` (FK), `property_id` (FK)
  - `agreement_number` (Unique, e.g. `AGR-GJ-2026-9F3130`)
  - `agreement_type` (`RESIDENTIAL`, `COMMERCIAL`, `LEAVE_AND_LICENSE`)
  - `duration_months` (default 11)
  - `monthly_rent`, `security_deposit`, `escalation_percentage` (default 5%)
  - `state_code` (`GJ`, `MH`, `KA`, `DL`, `TN`, `TS`, `UP`)
  - `stamp_duty_amount` (Computed via state formula)
  - `stamp_certificate_number` (e.g. `IN-GJ89204189024X`)
  - `status` (`DRAFT`, `INVITED`, `AWAITING_ESIGN`, `COMPLETED`, `CANCELLED`)
  - `pdf_url` (File path to signed stamp deed)
  - `qr_verification_hash` (SHA-256 for public validation)

---

## ⚡ Database Performance & Indexing Strategy

1. **Composite B-Tree Indexes**:
   - `(city, property_type, is_published)` on `Property` for sub-10ms marketplace queries.
   - `(latitude, longitude)` on `Property` for radius and map viewport filtering.
   - `(organization_id, status)` on `Invoice` and `Tenancy` for owner dashboard metrics.
2. **Foreign Key Cascade Strategies**:
   - `Property ➔ Building ➔ Floor ➔ Room ➔ Bed`: `on_delete=models.CASCADE`
   - `Tenancy ➔ Invoice`: `on_delete=models.PROTECT` (prevents accidental deletion of tax records)
   - `Agreement ➔ User`: `on_delete=models.PROTECT` (maintains legal audit trail)
3. **Database Concurrency Isolation**:
   - Read Committed (PostgreSQL / SQLite) with atomic transaction wrapping on financial payments and bed check-ins.
