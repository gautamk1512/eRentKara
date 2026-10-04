import os
import django
from datetime import date, timedelta
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "erentkarar.settings")
django.setup()

from apps.accounts.models import User, UserProfile
from apps.organizations.models import Organization, OrganizationMember
from apps.properties.models import Property, PropertyType, PropertyAmenity, Building, Floor, Room, Bed, PropertyImage
from apps.tenants.models import Tenancy, MoveIn
from apps.billing.models import Invoice, InvoiceItem
from apps.agreements.models import StateConfiguration, AgreementTemplate
from apps.leads.models import Lead
from apps.complaints.models import Complaint
from apps.mess.models import MessPlan, MessMenu
from apps.referrals.models import ReferralCode

def run_seed():
    print(">> Starting eRentKarar Master Seed Data Generator...")

    # 1. Indian State Stamp Duty Configs
    states = [
        {"code": "KA", "name": "Karnataka", "stamp": 100.0, "reg": 0.0, "act": "The Karnataka Rent Control Act / Model Tenancy"},
        {"code": "MH", "name": "Maharashtra", "stamp": 500.0, "reg": 1000.0, "act": "Maharashtra Rent Control Act"},
        {"code": "DL", "name": "Delhi NCR", "stamp": 100.0, "reg": 0.0, "act": "Delhi Rent Control Act"},
        {"code": "TN", "name": "Tamil Nadu", "stamp": 100.0, "reg": 100.0, "act": "Tamil Nadu Tenancy Regulation Act"},
        {"code": "TS", "name": "Telangana", "stamp": 100.0, "reg": 0.0, "act": "Telangana Buildings Lease and Rent Control"},
    ]
    for s in states:
        StateConfiguration.objects.get_or_create(
            state_code=s["code"],
            defaults={"state_name": s["name"], "base_stamp_duty": s["stamp"], "registration_fee": s["reg"], "legal_tenancy_act_reference": s["act"]}
        )

    # 2. Amenities
    amenities_data = [
        ("High-Speed WiFi", "wifi", "Connectivity"),
        ("Air Conditioner (AC)", "wind", "Comfort"),
        ("Attached Bathroom", "bath", "Hygiene"),
        ("Daily Housekeeping", "sparkles", "Services"),
        ("3-Times Homestyle Food", "utensils", "Food"),
        ("Power Backup (Inverter/DG)", "zap", "Utilities"),
        ("RO Mineral Water", "droplets", "Utilities"),
        ("Automatic Washing Machine", "disc", "Laundry"),
        ("24x7 CCTV & Biometric Security", "shield", "Security"),
        ("Lift / Elevator", "arrow-up-circle", "Convenience"),
        ("Two Wheeler Parking", "bike", "Parking"),
        ("Refrigerator", "refrigerator", "Appliance"),
    ]
    amenities = []
    for name, icon, cat in amenities_data:
        a, _ = PropertyAmenity.objects.get_or_create(name=name, defaults={"icon": icon, "category": cat})
        amenities.append(a)

    # 3. Super Admin & Owner & Tenant
    admin_user, _ = User.objects.get_or_create(
        email="admin@erentkarar.com",
        defaults={"role": User.RoleChoices.SUPER_ADMIN, "first_name": "Antigravity", "last_name": "Admin", "is_staff": True, "is_superuser": True}
    )
    admin_user.set_password("Admin@12345")
    admin_user.save()

    owner_user, _ = User.objects.get_or_create(
        email="owner@erentkarar.com",
        defaults={"phone_number": "9876543210", "role": User.RoleChoices.OWNER, "first_name": "Rajesh", "last_name": "Sharma"}
    )
    owner_user.set_password("Password123!")
    owner_user.save()
    UserProfile.objects.get_or_create(user=owner_user, defaults={"full_name": "Rajesh Sharma", "preferred_city": "Bengaluru"})
    ReferralCode.objects.get_or_create(user=owner_user, defaults={"code": "RAJESH100"})

    tenant_user, _ = User.objects.get_or_create(
        email="tenant@erentkarar.com",
        defaults={"phone_number": "9123456789", "role": User.RoleChoices.TENANT, "first_name": "Aman", "last_name": "Verma"}
    )
    tenant_user.set_password("Password123!")
    tenant_user.save()
    UserProfile.objects.get_or_create(user=tenant_user, defaults={"full_name": "Aman Verma", "preferred_city": "Bengaluru"})

    # 4. Organization
    org, _ = Organization.objects.get_or_create(
        name="Starlight Stays & PG Hospitality",
        defaults={
            "legal_business_name": "Starlight Hospitality Private Limited",
            "gstin": "29AABCS1429B1Z8",
            "contact_email": "hello@starlightstays.in",
            "contact_phone": "9876543210",
            "address": "4th Cross, 5th Block, Koramangala",
            "city": "Bengaluru",
            "state": "Karnataka",
            "pincode": "560095",
            "is_verified": True,
        }
    )
    OrganizationMember.objects.get_or_create(organization=org, user=owner_user, defaults={"role": OrganizationMember.MemberRole.OWNER})

    # 5. Property 1: Starlight Luxury Co-Living (Koramangala)
    prop1, created = Property.objects.get_or_create(
        slug="starlight-luxury-coliving-koramangala-bengaluru",
        defaults={
            "organization": org,
            "title": "Starlight Luxury Co-Living & PG",
            "property_type": PropertyType.CO_LIVING,
            "description": "Premium techie-friendly co-living space in the heart of Koramangala. Features chef-prepared nutritious meals, blazing 300 Mbps WiFi, ergonomic study desks, air conditioning, and daily professional housekeeping. Ideal for working professionals in Sony World / Forum Mall belt.",
            "address": "#42, 80 Feet Road, 4th Block, Koramangala",
            "locality": "Koramangala 4th Block",
            "city": "Bengaluru",
            "state": "Karnataka",
            "pincode": "560034",
            "latitude": Decimal("12.935242"),
            "longitude": Decimal("77.624461"),
            "nearby_landmarks": "Opposite Sony World Signal, Behind BDA Complex",
            "monthly_rent_starting": Decimal("12500.00"),
            "security_deposit": Decimal("25000.00"),
            "maintenance_charges": Decimal("500.00"),
            "notice_period_days": 30,
            "minimum_stay_months": 3,
            "gender_preference": Property.GenderPreference.ANY,
            "food_included": True,
            "food_type": "Veg & Non-Veg (North & South Indian)",
            "is_published": True,
            "is_featured": True,
            "verification_status": Property.VerificationStatus.VERIFIED,
        }
    )
    prop1.amenities.set(amenities)

    # Property 1 Images
    images_p1 = [
        ("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80", True, "Modern Living Room"),
        ("https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", False, "Twin Sharing Bedroom"),
        ("https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80", False, "Lounge & Coworking Area"),
    ]
    for url, is_c, cap in images_p1:
        PropertyImage.objects.get_or_create(property=prop1, image_url=url, defaults={"is_cover": is_c, "caption": cap})

    # Building & Units for Property 1
    bldg1, _ = Building.objects.get_or_create(property=prop1, name="Wing A - Premium", defaults={"description": "Main Tower"})
    floor1, _ = Floor.objects.get_or_create(building=bldg1, floor_number=1, defaults={"name": "1st Floor"})
    floor2, _ = Floor.objects.get_or_create(building=bldg1, floor_number=2, defaults={"name": "2nd Floor"})

    # Room 101 (Double Sharing)
    room101, _ = Room.objects.get_or_create(
        floor=floor1,
        room_number="101",
        defaults={
            "room_type": Room.RoomType.DOUBLE,
            "furnishing": Room.Furnishing.FULLY_FURNISHED,
            "base_rent": Decimal("14000.00"),
            "default_deposit": Decimal("28000.00"),
            "has_attached_bathroom": True,
            "has_ac": True,
            "has_balcony": True,
        }
    )
    bed101A, _ = Bed.objects.get_or_create(room=room101, bed_identifier="101-A", defaults={"rent_amount": Decimal("14000.00"), "deposit_amount": Decimal("28000.00"), "status": Bed.BedStatus.AVAILABLE})
    bed101B, _ = Bed.objects.get_or_create(room=room101, bed_identifier="101-B", defaults={"rent_amount": Decimal("14000.00"), "deposit_amount": Decimal("28000.00"), "status": Bed.BedStatus.AVAILABLE})

    # Room 201 (Double Sharing - Occupied by Aman Verma)
    room201, _ = Room.objects.get_or_create(
        floor=floor2,
        room_number="201",
        defaults={
            "room_type": Room.RoomType.DOUBLE,
            "furnishing": Room.Furnishing.FULLY_FURNISHED,
            "base_rent": Decimal("13500.00"),
            "default_deposit": Decimal("27000.00"),
            "has_attached_bathroom": True,
            "has_ac": True,
        }
    )
    bed201A, _ = Bed.objects.get_or_create(room=room201, bed_identifier="201-A", defaults={"rent_amount": Decimal("13500.00"), "deposit_amount": Decimal("27000.00"), "status": Bed.BedStatus.OCCUPIED})
    bed201B, _ = Bed.objects.get_or_create(room=room201, bed_identifier="201-B", defaults={"rent_amount": Decimal("13500.00"), "deposit_amount": Decimal("27000.00"), "status": Bed.BedStatus.AVAILABLE})

    # Room 202 (Single Private Studio)
    room202, _ = Room.objects.get_or_create(
        floor=floor2,
        room_number="202",
        defaults={
            "room_type": Room.RoomType.SINGLE,
            "furnishing": Room.Furnishing.FULLY_FURNISHED,
            "base_rent": Decimal("22000.00"),
            "default_deposit": Decimal("44000.00"),
            "has_attached_bathroom": True,
            "has_ac": True,
            "has_balcony": True,
        }
    )
    bed202, _ = Bed.objects.get_or_create(room=room202, bed_identifier="202-Single", defaults={"rent_amount": Decimal("22000.00"), "deposit_amount": Decimal("44000.00"), "status": Bed.BedStatus.AVAILABLE})

    # 6. Active Tenancy for Tenant (Aman Verma)
    today = date.today()
    start_date = today - timedelta(days=60)
    tenancy, _ = Tenancy.objects.get_or_create(
        tenant=tenant_user,
        property=prop1,
        defaults={
            "room": room201,
            "bed": bed201A,
            "start_date": start_date,
            "monthly_rent": Decimal("13500.00"),
            "security_deposit_paid": Decimal("27000.00"),
            "status": Tenancy.TenancyStatus.ACTIVE,
        }
    )
    MoveIn.objects.get_or_create(tenancy=tenancy, defaults={"actual_move_in_date": start_date, "keys_handed_over": True})

    # 7. Invoices (Current Month & Previous Month)
    # Previous Month - PAID
    prev_month = 8 if today.month == 9 else (today.month - 1 or 12)
    prev_year = today.year if today.month != 1 else today.year - 1
    inv_prev, _ = Invoice.objects.get_or_create(
        tenancy=tenancy,
        billing_month=prev_month,
        billing_year=prev_year,
        defaults={
            "base_rent": Decimal("13500.00"),
            "maintenance_charges": Decimal("500.00"),
            "total_amount": Decimal("14000.00"),
            "paid_amount": Decimal("14000.00"),
            "due_date": date(prev_year, prev_month, 5),
            "status": Invoice.InvoiceStatus.PAID,
        }
    )

    # Current Month - PENDING / ISSUED
    inv_curr, _ = Invoice.objects.get_or_create(
        tenancy=tenancy,
        billing_month=today.month,
        billing_year=today.year,
        defaults={
            "base_rent": Decimal("13500.00"),
            "maintenance_charges": Decimal("500.00"),
            "electricity_charges": Decimal("650.00"),
            "total_amount": Decimal("14650.00"),
            "paid_amount": Decimal("0.00"),
            "due_date": date(today.year, today.month, 5),
            "status": Invoice.InvoiceStatus.ISSUED,
        }
    )
    InvoiceItem.objects.get_or_create(invoice=inv_curr, title="Monthly Room Rent", defaults={"amount": Decimal("13500.00"), "category": "RENT"})
    InvoiceItem.objects.get_or_create(invoice=inv_curr, title="Common Maintenance & Housekeeping", defaults={"amount": Decimal("500.00"), "category": "MAINTENANCE"})
    InvoiceItem.objects.get_or_create(invoice=inv_curr, title="Sub-Meter Electricity (65 units @ ₹10)", defaults={"amount": Decimal("650.00"), "category": "ELECTRICITY"})

    # 8. Sample Property 2: Greenfield Executive PG (HSR Layout)
    prop2, _ = Property.objects.get_or_create(
        slug="greenfield-executive-pg-hsr-layout-bengaluru",
        defaults={
            "organization": org,
            "title": "Greenfield Executive Boys PG",
            "property_type": PropertyType.PG,
            "description": "Affordable and peaceful PG accommodation for students and young working professionals in HSR Layout Sector 2. Walking distance from 27th Main food street.",
            "address": "#78, 14th Main, Sector 2, HSR Layout",
            "locality": "HSR Layout Sector 2",
            "city": "Bengaluru",
            "state": "Karnataka",
            "pincode": "560102",
            "latitude": Decimal("12.911622"),
            "longitude": Decimal("77.638862"),
            "nearby_landmarks": "Near NIFT College, 27th Main",
            "monthly_rent_starting": Decimal("8500.00"),
            "security_deposit": Decimal("15000.00"),
            "gender_preference": Property.GenderPreference.MALE,
            "food_included": True,
            "food_type": "South & North Indian Meals",
            "is_published": True,
            "verification_status": Property.VerificationStatus.VERIFIED,
        }
    )
    prop2.amenities.set(amenities[:8])
    PropertyImage.objects.get_or_create(
        property=prop2,
        image_url="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        defaults={"is_cover": True, "caption": "HSR Layout PG Building"}
    )

    # 9. Sample Property 3: Metro Heights Studio Apartments (Indiranagar)
    prop3, _ = Property.objects.get_or_create(
        slug="metro-heights-studio-apartments-indiranagar-bengaluru",
        defaults={
            "organization": org,
            "title": "Metro Heights Studio 1BHKs",
            "property_type": PropertyType.STUDIO,
            "description": "Chic and private studio 1BHK apartments for couples and independent professionals. 200m from Indiranagar Metro Station.",
            "address": "#12, 100 Feet Road, HAL 2nd Stage, Indiranagar",
            "locality": "Indiranagar 100 Feet Road",
            "city": "Bengaluru",
            "state": "Karnataka",
            "pincode": "560038",
            "latitude": Decimal("12.978369"),
            "longitude": Decimal("77.640837"),
            "monthly_rent_starting": Decimal("26000.00"),
            "security_deposit": Decimal("50000.00"),
            "gender_preference": Property.GenderPreference.ANY,
            "food_included": False,
            "is_published": True,
            "verification_status": Property.VerificationStatus.VERIFIED,
        }
    )
    prop3.amenities.set(amenities)
    PropertyImage.objects.get_or_create(
        property=prop3,
        image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        defaults={"is_cover": True, "caption": "Studio Living Area"}
    )

    # 10. Sample Leads & Complaints
    Lead.objects.get_or_create(
        organization=org,
        name="Vikram Sethi",
        phone="9811223344",
        defaults={
            "email": "vikram@example.com",
            "property": prop1,
            "budget": Decimal("14000.00"),
            "preferred_location": "Koramangala",
            "status": Lead.LeadStatus.NEW,
            "notes": "Looking for AC double sharing from 1st of next month."
        }
    )

    Complaint.objects.get_or_create(
        organization=org,
        property=prop1,
        tenancy=tenancy,
        title="Geyser heating slowly in washroom",
        defaults={
            "category": Complaint.ComplaintCategory.APPLIANCE,
            "urgency": Complaint.Urgency.MEDIUM,
            "description": "The bathroom geyser takes over 25 minutes to heat water in Room 201.",
            "status": Complaint.ComplaintStatus.OPEN,
        }
    )

    # 11. Mess Menu
    days = [
        (1, "Masala Dosa, Chutney, Coffee", "Dal Fry, Jeera Rice, Chapati, Salad", "Paneer Butter Masala, Roti, Rice, Gulab Jamun"),
        (2, "Idli Vada Sambar, Tea", "Chole Bhature / Rice, Boondi Raita", "Egg Curry / Mixed Veg Korma, Rice, Phulka"),
        (3, "Aloo Paratha with Curd & Pickle", "Rajma Chawal, Roti, Pickle", "Chicken Sukka / Paneer Bhurji, Dal, Rice"),
        (4, "Poha / Upma, Sev, Ginger Tea", "Veg Biryani, Mirchi ka Salan, Raita", "Dal Tadka, Aloo Gobhi, Phulka, Kheer"),
        (5, "Puri Bhaji, Halwa, Coffee", "Kadhi Pakora, Rice, Roti, Papad", "Butter Chicken / Shahi Paneer, Naan, Rice"),
        (6, "Uttapam, Coconut Chutney, Tea", "Khichdi with Ghee, Papad, Chokha", "Special Fried Rice, Manchurian, Soup"),
        (7, "Chole Puri / Bread Omelette, Tea", "Special Sunday Dum Biryani (Veg/Chicken)", "Light Roti, Moong Dal, Khichdi"),
    ]
    for d, b, l, din in days:
        MessMenu.objects.get_or_create(
            property=prop1,
            day_of_week=d,
            defaults={"breakfast": b, "lunch": l, "dinner": din}
        )

    print("[SUCCESS] Seed data successfully created!")
    print("[AUTH] Admin Login: admin@erentkarar.com / Admin@12345")
    print("[AUTH] Owner Login: owner@erentkarar.com / Password123!")
    print("[AUTH] Tenant Login: tenant@erentkarar.com / Password123!")

if __name__ == "__main__":
    run_seed()
