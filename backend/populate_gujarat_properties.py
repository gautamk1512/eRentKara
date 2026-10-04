import os
import django
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "erentkarar.settings")
django.setup()

from apps.accounts.models import User, UserProfile
from apps.organizations.models import Organization, OrganizationMember
from apps.properties.models import Property, PropertyType, PropertyAmenity, Building, Floor, Room, Bed, PropertyImage
from apps.agreements.models import StateConfiguration

def populate_gujarat():
    print(">> Seeding Gujarat & Vadodara Properties & Co-Living Inventory...")

    # 1. Ensure Gujarat State Configuration
    StateConfiguration.objects.get_or_create(
        state_code="GJ",
        defaults={
            "state_name": "Gujarat",
            "base_stamp_duty": 300.0,
            "registration_fee": 1000.0,
            "legal_tenancy_act_reference": "Gujarat Stamp Act 1958 Article 30 & Model Tenancy Act 2021",
        }
    )

    # 2. Get or create owner user
    owner_user, _ = User.objects.get_or_create(
        email="owner@erentkarar.com",
        defaults={
            "phone_number": "9876543210",
            "role": User.RoleChoices.OWNER,
            "first_name": "Rajesh",
            "last_name": "Patel",
        }
    )
    owner_user.set_password("Password123!")
    owner_user.save()
    UserProfile.objects.get_or_create(user=owner_user, defaults={"full_name": "Rajesh Patel", "preferred_city": "Vadodara"})

    # 3. Organization for Gujarat
    org, _ = Organization.objects.get_or_create(
        name="Gujarat Royal Stays & Co-Living Group",
        defaults={
            "legal_business_name": "Gujarat Royal Stays Private Limited",
            "gstin": "24AABCG1234F1Z9",
            "contact_email": "stays@gujaratroyal.in",
            "contact_phone": "9876543210",
            "address": "402, Alkapuri Arcade, RC Dutt Road, Alkapuri",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "390007",
            "is_verified": True,
        }
    )
    OrganizationMember.objects.get_or_create(organization=org, user=owner_user, defaults={"role": OrganizationMember.MemberRole.OWNER})

    # Amenities
    amenities = list(PropertyAmenity.objects.all())

    # 4. Comprehensive List of Gujarat Properties (Focus: Vadodara & Major Hubs)
    gujarat_properties = [
        # --- VADODARA PROPERTIES ---
        {
            "title": "Royal Palms Luxury Co-Living & PG",
            "slug": "royal-palms-luxury-coliving-alkapuri-vadodara",
            "property_type": PropertyType.CO_LIVING,
            "description": "High-end executive co-living space in Alkapuri, Vadodara. Offers chef-prepared nutritious Gujarati & North Indian meals, high-speed 300 Mbps fiber WiFi, daily housekeeping, biometric access, and split air conditioning. Just 5 mins from Vadodara Central & Inox.",
            "address": "14, Sampatrao Colony, RC Dutt Road, Alkapuri",
            "locality": "Alkapuri",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "390007",
            "latitude": Decimal("22.310695"),
            "longitude": Decimal("73.170494"),
            "nearby_landmarks": "Opposite Inox Multiplex, Near Alkapuri Railway Underpass",
            "monthly_rent_starting": Decimal("8500.00"),
            "security_deposit": Decimal("17000.00"),
            "maintenance_charges": Decimal("400.00"),
            "gender_preference": Property.GenderPreference.ANY,
            "food_included": True,
            "food_type": "Gujarati & North Indian Veg Meals",
            "is_featured": True,
            "electricity_consumer_number": "MGVCL-CA-40291823",
            "electricity_board_discom": "MGVCL (Madhya Gujarat Vij Company)",
            "rooms": [
                {"number": "101", "type": Room.RoomType.DOUBLE, "rent": Decimal("9500.00"), "beds": ["101-A", "101-B"]},
                {"number": "102", "type": Room.RoomType.SINGLE, "rent": Decimal("15000.00"), "beds": ["102-Single"]},
                {"number": "201", "type": Room.RoomType.TRIPLE, "rent": Decimal("7500.00"), "beds": ["201-A", "201-B", "201-C"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Sayaji Scholar & Professional PG",
            "slug": "sayaji-scholar-pg-sayajigunj-vadodara",
            "property_type": PropertyType.PG,
            "description": "Clean, secure, and budget-friendly PG accommodation near Maharaja Sayajirao University (MSU) and Vadodara Junction Railway Station. Ideal for students, competitive exam aspirants, and working professionals.",
            "address": "B-22, Sayaji Vihar Complex, Near Station Road, Sayajigunj",
            "locality": "Sayajigunj",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "390020",
            "latitude": Decimal("22.312900"),
            "longitude": Decimal("73.181200"),
            "nearby_landmarks": "200m from Vadodara Junction Platform 1, Near MSU Arts Faculty",
            "monthly_rent_starting": Decimal("6200.00"),
            "security_deposit": Decimal("10000.00"),
            "gender_preference": Property.GenderPreference.MALE,
            "food_included": True,
            "food_type": "Pure Veg Gujarati Kathiyawadi & Punjabi Meals",
            "electricity_consumer_number": "MGVCL-CA-99381023",
            "electricity_board_discom": "MGVCL",
            "rooms": [
                {"number": "A-1", "type": Room.RoomType.DOUBLE, "rent": Decimal("6500.00"), "beds": ["A1-1", "A1-2"]},
                {"number": "A-2", "type": Room.RoomType.TRIPLE, "rent": Decimal("5800.00"), "beds": ["A2-1", "A2-2", "A2-3"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Gotri Techie Residency & Executive Flats",
            "slug": "gotri-techie-residency-sevasi-road-vadodara",
            "property_type": PropertyType.FLAT,
            "description": "Spacious semi and fully furnished 2 BHK & 3 BHK flats on Gotri-Sevasi Road. Ideal for IT employees working around Gotri IT Corridor, pharma corporate executives, and nuclear families.",
            "address": "Tower 4, Green Terraces, Gotri-Sevasi Canal Road",
            "locality": "Gotri",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "390021",
            "latitude": Decimal("22.316800"),
            "longitude": Decimal("73.138200"),
            "nearby_landmarks": "Near Gotri Medical College & GMERS Hospital",
            "monthly_rent_starting": Decimal("14000.00"),
            "security_deposit": Decimal("30000.00"),
            "gender_preference": Property.GenderPreference.FAMILY,
            "food_included": False,
            "is_featured": True,
            "electricity_consumer_number": "MGVCL-CA-77291038",
            "electricity_board_discom": "MGVCL",
            "rooms": [
                {"number": "401", "type": Room.RoomType.TWO_BHK, "rent": Decimal("16000.00"), "beds": ["Flat-401"]},
                {"number": "402", "type": Room.RoomType.THREE_BHK, "rent": Decimal("22000.00"), "beds": ["Flat-402"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Fatehgunj University Girls Co-Living & Hostel",
            "slug": "fatehgunj-girls-coliving-vadodara",
            "property_type": PropertyType.CO_LIVING,
            "description": "Gated 24x7 biometric security girls hostel & co-living in Fatehgunj. Fully furnished AC rooms with attached washrooms, RO drinking water, high-speed WiFi, laundry, and daily wholesome home-style meals.",
            "address": "78, Shrinagar Society, Fatehgunj Main Road",
            "locality": "Fatehgunj",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "390002",
            "latitude": Decimal("22.325600"),
            "longitude": Decimal("73.187300"),
            "nearby_landmarks": "Opposite Rosary School, 300m from MSU Science Campus",
            "monthly_rent_starting": Decimal("7200.00"),
            "security_deposit": Decimal("14000.00"),
            "gender_preference": Property.GenderPreference.FEMALE,
            "food_included": True,
            "food_type": "Hygienic Pure Veg Multi-Cuisine",
            "electricity_consumer_number": "MGVCL-CA-11928374",
            "electricity_board_discom": "MGVCL",
            "rooms": [
                {"number": "G-101", "type": Room.RoomType.DOUBLE, "rent": Decimal("7800.00"), "beds": ["G101-A", "G101-B"]},
                {"number": "G-102", "type": Room.RoomType.TRIPLE, "rent": Decimal("6800.00"), "beds": ["G102-A", "G102-B", "G102-C"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Manjalpur Executive Residences & PG",
            "slug": "manjalpur-executive-residences-vadodara",
            "property_type": PropertyType.PG,
            "description": "Conveniently located in Manjalpur, close to Makarpura GIDC industrial area and schools. High-speed internet, dedicated 2-wheeler parking, backup power inverter, and optional tiffin service.",
            "address": "Plot 12, Darbar Chokdi, Manjalpur",
            "locality": "Manjalpur",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "390011",
            "latitude": Decimal("22.268900"),
            "longitude": Decimal("73.195600"),
            "nearby_landmarks": "Near Tulsidham Char Rasta, Makarpura GIDC",
            "monthly_rent_starting": Decimal("5800.00"),
            "security_deposit": Decimal("10000.00"),
            "gender_preference": Property.GenderPreference.MALE,
            "food_included": True,
            "food_type": "Veg Meals (Breakfast & Dinner)",
            "rooms": [
                {"number": "M-1", "type": Room.RoomType.DOUBLE, "rent": Decimal("6000.00"), "beds": ["M1-A", "M1-B"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Vasna Bhayli Luxury Studio & 1BHK Suites",
            "slug": "vasna-bhayli-luxury-studio-suites-vadodara",
            "property_type": PropertyType.STUDIO,
            "description": "Ultra-modern studio apartments and 1BHK furnished suites on prime Vasna-Bhayli Road. Features modular kitchenette, smart TV, inverter power backup, club amenities, and 24-hr security.",
            "address": "Floor 5, Elegance Heights, Vasna-Bhayli Main Road",
            "locality": "Vasna Road",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "391410",
            "latitude": Decimal("22.298100"),
            "longitude": Decimal("73.132500"),
            "nearby_landmarks": "Near D-Mart Bhayli, Near Bright Day School",
            "monthly_rent_starting": Decimal("12500.00"),
            "security_deposit": Decimal("25000.00"),
            "gender_preference": Property.GenderPreference.ANY,
            "food_included": False,
            "is_featured": True,
            "rooms": [
                {"number": "501", "type": Room.RoomType.STUDIO, "rent": Decimal("12500.00"), "beds": ["Studio-501"]},
                {"number": "502", "type": Room.RoomType.ONE_BHK, "rent": Decimal("15500.00"), "beds": ["Suite-502"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Akota Corporate Serviced Flats",
            "slug": "akota-corporate-serviced-flats-vadodara",
            "property_type": PropertyType.FLAT,
            "description": "Executive 2BHK fully furnished apartment suites on Productivity Road, Akota. Preferred stay for corporate consultants, visiting doctors, and senior professionals.",
            "address": "B-Wing, Productivity Chambers, Akota",
            "locality": "Akota",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "390020",
            "latitude": Decimal("22.296500"),
            "longitude": Decimal("73.167200"),
            "nearby_landmarks": "Near Akota Stadium & Circuit House",
            "monthly_rent_starting": Decimal("20000.00"),
            "security_deposit": Decimal("40000.00"),
            "gender_preference": Property.GenderPreference.FAMILY,
            "food_included": False,
            "rooms": [
                {"number": "201", "type": Room.RoomType.TWO_BHK, "rent": Decimal("20000.00"), "beds": ["Akota-201"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Karelibaug Student & Youth PG",
            "slug": "karelibaug-student-pg-vadodara",
            "property_type": PropertyType.PG,
            "description": "Affordable boys PG with hygienic daily food, RO water, and high-speed WiFi near Amrapali Complex, Karelibaug. Walkable distance to coaching centers and bus depots.",
            "address": "12, Anand Baug Society, Near Water Tank, Karelibaug",
            "locality": "Karelibaug",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "390018",
            "latitude": Decimal("22.327800"),
            "longitude": Decimal("73.203400"),
            "nearby_landmarks": "Near Amrapali Cinema Complex & Baroda Museum",
            "monthly_rent_starting": Decimal("6000.00"),
            "security_deposit": Decimal("10000.00"),
            "gender_preference": Property.GenderPreference.MALE,
            "food_included": True,
            "food_type": "Pure Gujarati Kathiyawadi Food",
            "rooms": [
                {"number": "K-1", "type": Room.RoomType.DOUBLE, "rent": Decimal("6500.00"), "beds": ["K1-A", "K1-B"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Parul Campus Edge Student Hostel",
            "slug": "parul-campus-edge-student-hostel-waghodia-vadodara",
            "property_type": PropertyType.STUDENT_HOUSING,
            "description": "Modern student hostel community situated on Waghodia Road right next to Parul University. AC and Non-AC double/triple sharing rooms with daily food, study hall, gym, and university shuttle.",
            "address": "Expressway Junction, Waghodia Road",
            "locality": "Waghodia Road",
            "city": "Vadodara",
            "state": "Gujarat",
            "pincode": "391760",
            "latitude": Decimal("22.291200"),
            "longitude": Decimal("73.364500"),
            "nearby_landmarks": "500m from Parul University Main Gate",
            "monthly_rent_starting": Decimal("5500.00"),
            "security_deposit": Decimal("11000.00"),
            "gender_preference": Property.GenderPreference.ANY,
            "food_included": True,
            "food_type": "3 Meals Included (North, South, Gujarati)",
            "rooms": [
                {"number": "W-101", "type": Room.RoomType.DOUBLE, "rent": Decimal("6500.00"), "beds": ["W101-A", "W101-B"]},
                {"number": "W-102", "type": Room.RoomType.TRIPLE, "rent": Decimal("5500.00"), "beds": ["W102-A", "W102-B", "W102-C"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
            ],
        },

        # --- AHMEDABAD PROPERTIES ---
        {
            "title": "Shivalik Highstreet Executive Co-Living",
            "slug": "shivalik-highstreet-coliving-vastrapur-ahmedabad",
            "property_type": PropertyType.CO_LIVING,
            "description": "Elite co-living in Vastrapur, Ahmedabad. Premium AC rooms, high-speed WiFi, gym access, cafe lounge, and daily housekeeping near IIM Ahmedabad and AlphaOne Mall.",
            "address": "Floor 4, Shivalik Highstreet, Vastrapur Lake Road",
            "locality": "Vastrapur",
            "city": "Ahmedabad",
            "state": "Gujarat",
            "pincode": "380015",
            "latitude": Decimal("23.036500"),
            "longitude": Decimal("72.529800"),
            "nearby_landmarks": "Opposite Vastrapur Lake, 500m from IIM Ahmedabad",
            "monthly_rent_starting": Decimal("13500.00"),
            "security_deposit": Decimal("27000.00"),
            "gender_preference": Property.GenderPreference.ANY,
            "food_included": True,
            "food_type": "Chef Curated Healthy Meals",
            "is_featured": True,
            "electricity_consumer_number": "TORRENT-AHM-829102",
            "electricity_board_discom": "Torrent Power Ahmedabad",
            "rooms": [
                {"number": "401", "type": Room.RoomType.DOUBLE, "rent": Decimal("14000.00"), "beds": ["SH-401A", "SH-401B"]},
                {"number": "402", "type": Room.RoomType.SINGLE, "rent": Decimal("22000.00"), "beds": ["SH-402"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
            ],
        },
        {
            "title": "Navrangpura Scholars Hub & PG",
            "slug": "navrangpura-scholars-hub-ahmedabad",
            "property_type": PropertyType.PG,
            "description": "Central Ahmedabad PG for Gujarat University students, CA students, and IT employees. Quiet study atmosphere, high-speed WiFi, and wholesome home meals.",
            "address": "18, University Road, Near St. Xavier's Corner, Navrangpura",
            "locality": "Navrangpura",
            "city": "Ahmedabad",
            "state": "Gujarat",
            "pincode": "380009",
            "latitude": Decimal("23.038900"),
            "longitude": Decimal("72.551200"),
            "nearby_landmarks": "Near Gujarat University Campus & LD College",
            "monthly_rent_starting": Decimal("7800.00"),
            "security_deposit": Decimal("15000.00"),
            "gender_preference": Property.GenderPreference.MALE,
            "food_included": True,
            "food_type": "Veg Gujarati & Punjabi Meals",
            "rooms": [
                {"number": "N-101", "type": Room.RoomType.DOUBLE, "rent": Decimal("8500.00"), "beds": ["N101-A", "N101-B"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
            ],
        },

        # --- SURAT PROPERTIES ---
        {
            "title": "Vesu Diamond City Luxury Co-Living",
            "slug": "vesu-diamond-city-coliving-surat",
            "property_type": PropertyType.CO_LIVING,
            "description": "Upscale co-living residence in VIP Road, Vesu. Air-conditioned rooms with high-speed WiFi, work desks, and full security. Minutes from Surat Diamond Bourse & SVNIT.",
            "address": "Plot 24, VIP Road, Vesu",
            "locality": "Vesu",
            "city": "Surat",
            "state": "Gujarat",
            "pincode": "395007",
            "latitude": Decimal("21.141200"),
            "longitude": Decimal("72.772500"),
            "nearby_landmarks": "Near Surat Airport Corridor & SVNIT",
            "monthly_rent_starting": Decimal("10500.00"),
            "security_deposit": Decimal("20000.00"),
            "gender_preference": Property.GenderPreference.ANY,
            "food_included": True,
            "food_type": "Veg Gourmet Meals",
            "electricity_consumer_number": "TORRENT-SRT-992819",
            "electricity_board_discom": "Torrent Power Surat",
            "rooms": [
                {"number": "V-1", "type": Room.RoomType.DOUBLE, "rent": Decimal("11000.00"), "beds": ["V1-A", "V1-B"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
            ],
        },

        # --- GANDHINAGAR PROPERTIES ---
        {
            "title": "Infocity GIFT City Tech Co-Living Hub",
            "slug": "infocity-gift-city-tech-coliving-gandhinagar",
            "property_type": PropertyType.CO_LIVING,
            "description": "Tech co-living ecosystem designed for IT software engineers and finance professionals in Infocity & GIFT City corridor. Biometric security, 400 Mbps WiFi, lounge, and cafe.",
            "address": "Tower C, Infocity IT Park, Sector 0",
            "locality": "Infocity",
            "city": "Gandhinagar",
            "state": "Gujarat",
            "pincode": "382007",
            "latitude": Decimal("23.189500"),
            "longitude": Decimal("72.632100"),
            "nearby_landmarks": "Inside Infocity IT Park Campus, 10 min from GIFT City",
            "monthly_rent_starting": Decimal("9800.00"),
            "security_deposit": Decimal("18000.00"),
            "gender_preference": Property.GenderPreference.ANY,
            "food_included": True,
            "food_type": "Veg & Healthy Breakfast + Dinner",
            "rooms": [
                {"number": "IC-1", "type": Room.RoomType.DOUBLE, "rent": Decimal("10500.00"), "beds": ["IC1-A", "IC1-B"]},
            ],
            "images": [
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
            ],
        },
    ]

    created_count = 0
    updated_count = 0

    for pdata in gujarat_properties:
        slug = pdata["slug"]
        rooms_data = pdata.pop("rooms", [])
        images_data = pdata.pop("images", [])

        prop, created = Property.objects.get_or_create(
            slug=slug,
            defaults={
                "organization": org,
                "title": pdata["title"],
                "property_type": pdata["property_type"],
                "description": pdata["description"],
                "address": pdata["address"],
                "locality": pdata["locality"],
                "city": pdata["city"],
                "state": pdata["state"],
                "pincode": pdata["pincode"],
                "latitude": pdata.get("latitude"),
                "longitude": pdata.get("longitude"),
                "nearby_landmarks": pdata.get("nearby_landmarks", ""),
                "monthly_rent_starting": pdata["monthly_rent_starting"],
                "security_deposit": pdata.get("security_deposit", Decimal("0.0")),
                "maintenance_charges": pdata.get("maintenance_charges", Decimal("0.0")),
                "gender_preference": pdata.get("gender_preference", Property.GenderPreference.ANY),
                "food_included": pdata.get("food_included", False),
                "food_type": pdata.get("food_type", ""),
                "is_published": True,
                "is_featured": pdata.get("is_featured", False),
                "verification_status": Property.VerificationStatus.VERIFIED,
                "electricity_consumer_number": pdata.get("electricity_consumer_number", "MGVCL-VERIFIED-1092"),
                "electricity_board_discom": pdata.get("electricity_board_discom", "MGVCL"),
                "ownership_warranty_accepted": True,
            }
        )

        if created:
            created_count += 1
        else:
            updated_count += 1

        # Attach amenities
        prop.amenities.set(amenities[:8])

        # Attach Images
        for i, img_url in enumerate(images_data):
            PropertyImage.objects.get_or_create(
                property=prop,
                image_url=img_url,
                defaults={"is_cover": i == 0, "caption": f"{prop.title} view {i+1}"}
            )

        # Build Building & Rooms & Beds
        bldg, _ = Building.objects.get_or_create(property=prop, name="Main Wing", defaults={"description": "Primary Residential Tower"})
        floor, _ = Floor.objects.get_or_create(building=bldg, floor_number=1, defaults={"name": "Ground / 1st Floor"})

        for rdata in rooms_data:
            room, _ = Room.objects.get_or_create(
                floor=floor,
                room_number=rdata["number"],
                defaults={
                    "room_type": rdata["type"],
                    "furnishing": Room.Furnishing.FULLY_FURNISHED,
                    "base_rent": rdata["rent"],
                    "default_deposit": rdata["rent"] * 2,
                    "has_attached_bathroom": True,
                    "has_ac": True,
                }
            )
            for bed_id in rdata.get("beds", []):
                Bed.objects.get_or_create(
                    room=room,
                    bed_identifier=bed_id,
                    defaults={
                        "rent_amount": rdata["rent"],
                        "deposit_amount": rdata["rent"] * 2,
                        "status": Bed.BedStatus.AVAILABLE,
                    }
                )

    print(f"[SUCCESS] Gujarat inventory loaded: {created_count} created, {updated_count} existing.")
    total_vadodara = Property.objects.filter(city__iexact="Vadodara").count()
    total_gujarat = Property.objects.filter(state__in=["Gujarat", "GJ"]).count()
    print(f">> LIVE STATS: Vadodara properties in DB: {total_vadodara} | Total Gujarat properties in DB: {total_gujarat}")

if __name__ == "__main__":
    populate_gujarat()
