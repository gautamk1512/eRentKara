import uuid
from django.db import models
from django.utils.text import slugify
from apps.organizations.models import Organization

class PropertyType(models.TextChoices):
    PG = "PG", "PG (Paying Guest)"
    HOSTEL = "HOSTEL", "Hostel"
    FLAT = "FLAT", "Flat / Apartment"
    ROOM = "ROOM", "Private Room"
    SHARED_ROOM = "SHARED_ROOM", "Shared Room"
    STUDIO = "STUDIO", "Studio Apartment"
    CO_LIVING = "CO_LIVING", "Co-Living Space"
    VILLA = "VILLA", "Independent House / Villa"
    STUDENT_HOUSING = "STUDENT_HOUSING", "Student Housing"
    WORKING_PROFESSIONAL = "WORKING_PROFESSIONAL", "Working Professional Housing"

class PropertyAmenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon identifier, e.g. wifi, tv, wind")
    category = models.CharField(max_length=50, default="General")

    def __str__(self):
        return self.name

class Property(models.Model):
    class GenderPreference(models.TextChoices):
        ANY = "ANY", "Any / Co-ed"
        MALE = "MALE", "Male Only (Boys)"
        FEMALE = "FEMALE", "Female Only (Girls)"
        FAMILY = "FAMILY", "Families Only"

    class VerificationStatus(models.TextChoices):
        UNVERIFIED = "UNVERIFIED", "Unverified"
        PENDING = "PENDING", "Pending Verification"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="properties")
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    property_type = models.CharField(max_length=30, choices=PropertyType.choices, default=PropertyType.PG)
    description = models.TextField()

    # Address & Geo
    address = models.CharField(max_length=255)
    locality = models.CharField(max_length=150)
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, default="Karnataka")
    pincode = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    nearby_landmarks = models.CharField(max_length=255, blank=True)

    # Pricing & Terms
    monthly_rent_starting = models.DecimalField(max_digits=10, decimal_places=2, help_text="In INR (₹)")
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    maintenance_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    notice_period_days = models.IntegerField(default=30)
    minimum_stay_months = models.IntegerField(default=1)

    # Preferences & Facilities
    gender_preference = models.CharField(max_length=20, choices=GenderPreference.choices, default=GenderPreference.ANY)
    food_included = models.BooleanField(default=False)
    food_type = models.CharField(max_length=50, blank=True, help_text="Veg, Non-Veg, Both")
    electricity_policy = models.CharField(max_length=100, default="As per sub-meter reading (₹10/unit)")
    water_policy = models.CharField(max_length=100, default="Included in rent")
    house_rules = models.TextField(blank=True, default="No smoking inside rooms. Gate closes at 11:00 PM.")

    class OwnershipDocType(models.TextChoices):
        ELECTRICITY_BILL = "ELECTRICITY_BILL", "Electricity / Utility Bill"
        PROPERTY_TAX_RECEIPT = "PROPERTY_TAX_RECEIPT", "Municipal Property Tax Challan"
        SALE_DEED = "SALE_DEED", "Registered Sale Deed / Title Deed"
        SOCIETY_MAINTENANCE_BILL = "SOCIETY_MAINTENANCE_BILL", "Society Maintenance Receipt"
        POA_AUTHORIZATION = "POA_AUTHORIZATION", "Power of Attorney / Authorization"
        OTHER = "OTHER", "Other Ownership Document"

    class OwnershipVerificationMethod(models.TextChoices):
        UTILITY_API = "UTILITY_API", "Instant Utility API (BBPS / DISCOM)"
        DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD", "Document Review / OCR"
        SELF_WARRANTY = "SELF_WARRANTY", "Self Title Warranty & Undertaking"

    # Status & Marketplace Flags
    is_published = models.BooleanField(default=False, db_index=True)
    is_featured = models.BooleanField(default=False)
    verification_status = models.CharField(max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.PENDING)

    # Ownership & Legal Verification Fields (India Property Title Verification)
    ownership_document_type = models.CharField(
        max_length=40,
        choices=OwnershipDocType.choices,
        default=OwnershipDocType.ELECTRICITY_BILL,
        blank=True
    )
    electricity_consumer_number = models.CharField(max_length=60, blank=True, help_text="DISCOM Consumer / CA / Service Connection Number")
    electricity_board_discom = models.CharField(max_length=120, blank=True, help_text="e.g. BESCOM, Torrent Power, TATA Power, BSES, MSEDCL, UGVCL")
    property_tax_id = models.CharField(max_length=60, blank=True, help_text="Municipal Property PID / Khata / Assessment Number")
    ownership_document_file = models.FileField(upload_to="property_ownership_docs/%Y/%m/", null=True, blank=True)
    ownership_verification_method = models.CharField(
        max_length=30,
        choices=OwnershipVerificationMethod.choices,
        default=OwnershipVerificationMethod.UTILITY_API,
        blank=True
    )
    ownership_warranty_accepted = models.BooleanField(
        default=False,
        help_text="Landlord accepts statutory title warranty under Indian law"
    )
    ownership_verified_at = models.DateTimeField(null=True, blank=True)
    ownership_verified_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_properties"
    )
    ownership_verification_notes = models.TextField(blank=True)

    amenities = models.ManyToManyField(PropertyAmenity, blank=True, related_name="properties")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-{self.locality}-{self.city}")
            slug = base_slug
            counter = 1
            while Property.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.locality}, {self.city}"

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image_url = models.URLField(max_length=500, blank=True, help_text="Remote or CDN image link")
    image = models.ImageField(upload_to="properties/", null=True, blank=True)
    is_cover = models.BooleanField(default=False)
    caption = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"Image for {self.property.title}"

class Building(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="buildings")
    name = models.CharField(max_length=100, help_text="e.g. Block A, Main Wing")
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.property.title} - {self.name}"

class Floor(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name="floors")
    floor_number = models.IntegerField(default=1)
    name = models.CharField(max_length=100, help_text="e.g. Ground Floor, 1st Floor")

    class Meta:
        ordering = ["floor_number"]

    def __str__(self):
        return f"{self.building.name} - {self.name}"

class Room(models.Model):
    class RoomType(models.TextChoices):
        SINGLE = "SINGLE", "Single Private Room"
        DOUBLE = "DOUBLE", "2 Sharing / Double"
        TRIPLE = "TRIPLE", "3 Sharing / Triple"
        FOUR_SHARING = "FOUR_SHARING", "4 Sharing"
        STUDIO = "STUDIO", "Studio Flat"
        ONE_BHK = "1BHK", "1 BHK Unit"
        TWO_BHK = "2BHK", "2 BHK Unit"
        THREE_BHK = "3BHK", "3 BHK Unit"
        DORMITORY = "DORMITORY", "Dormitory"

    class Furnishing(models.TextChoices):
        UNFURNISHED = "UNFURNISHED", "Unfurnished"
        SEMI_FURNISHED = "SEMI_FURNISHED", "Semi-Furnished"
        FULLY_FURNISHED = "FULLY_FURNISHED", "Fully Furnished"

    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name="rooms")
    room_number = models.CharField(max_length=50, help_text="e.g. 101, 202-B")
    room_type = models.CharField(max_length=30, choices=RoomType.choices, default=RoomType.DOUBLE)
    furnishing = models.CharField(max_length=20, choices=Furnishing.choices, default=Furnishing.FULLY_FURNISHED)
    base_rent = models.DecimalField(max_digits=10, decimal_places=2, help_text="Per person or entire room")
    default_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    has_attached_bathroom = models.BooleanField(default=True)
    has_ac = models.BooleanField(default=False)
    has_balcony = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Room {self.room_number} ({self.get_room_type_display()})"

class Bed(models.Model):
    class BedStatus(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        RESERVED = "RESERVED", "Reserved"
        OCCUPIED = "OCCUPIED", "Occupied"
        BLOCKED = "BLOCKED", "Blocked"
        MAINTENANCE = "MAINTENANCE", "Under Maintenance"
        NOTICE_PERIOD = "NOTICE_PERIOD", "On Notice"

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="beds")
    bed_identifier = models.CharField(max_length=20, help_text="e.g. Bed A, Bed B, Single")
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=BedStatus.choices, default=BedStatus.AVAILABLE, db_index=True)

    def __str__(self):
        return f"{self.room.room_number} - {self.bed_identifier} [{self.get_status_display()}]"
