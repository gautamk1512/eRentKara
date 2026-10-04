import os
import sys
import uuid
from datetime import date, timedelta
from decimal import Decimal
import django

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erentkarar.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.organizations.models import Organization, OrganizationMember
from apps.properties.models import Property, PropertyAmenity, Building, Floor, Room, Bed, PropertyImage
from apps.tenants.models import Tenancy, MoveIn, MoveOut
from apps.billing.models import Invoice, InvoiceItem, ElectricityReading
from apps.payments.models import Payment, PaymentAttempt
from apps.deposits.models import SecurityDeposit, DepositSettlement
from apps.complaints.models import Complaint, MaintenanceTicket
from apps.visitors.models import Visitor
from apps.mess.models import MessPlan, MessMenu, MealAttendance
from apps.staff.models import Staff
from apps.leads.models import Lead, LeadActivity, Visit
from apps.bookings.models import Booking
from apps.kyc.models import KYC, KYCDocument
from apps.referrals.models import ReferralCode, Referral, ReferralReward
from apps.subscriptions.models import SubscriptionPlan, OrganizationSubscription
from apps.notifications.models import Notification, CommunicationLog
from apps.agreements.models import Agreement, AgreementParty, AgreementTemplate, AgreementSigner, AgreementPayment, StateConfiguration

User = get_user_model()

print("🚀 Starting Comprehensive Rental OS Seeding...")

# 1. Ensure Subscription Plans exist
plans_data = [
    {
        "name": "Starter / Free Tier",
        "slug": "free-tier",
        "price_monthly": Decimal("0.00"),
        "price_annual": Decimal("0.00"),
        "max_properties": 2,
        "max_rooms": 15,
        "max_beds": 30,
        "max_staff": 2,
        "whatsapp_messages_per_month": 100,
        "ai_queries_per_month": 50,
        "has_custom_domain": False,
        "has_priority_support": False,
        "has_automated_rent_collection": True,
    },
    {
        "name": "Growth PG & Hostel Pro",
        "slug": "growth-pro",
        "price_monthly": Decimal("999.00"),
        "price_annual": Decimal("9990.00"),
        "max_properties": 10,
        "max_rooms": 100,
        "max_beds": 300,
        "max_staff": 10,
        "whatsapp_messages_per_month": 1500,
        "ai_queries_per_month": 500,
        "has_custom_domain": True,
        "has_priority_support": True,
        "has_automated_rent_collection": True,
    },
    {
        "name": "Enterprise Multi-City",
        "slug": "enterprise",
        "price_monthly": Decimal("2499.00"),
        "price_annual": Decimal("24990.00"),
        "max_properties": 50,
        "max_rooms": 500,
        "max_beds": 2000,
        "max_staff": 50,
        "whatsapp_messages_per_month": 10000,
        "ai_queries_per_month": 2000,
        "has_custom_domain": True,
        "has_priority_support": True,
        "has_automated_rent_collection": True,
    }
]

created_plans = {}
for pdata in plans_data:
    plan, _ = SubscriptionPlan.objects.get_or_create(slug=pdata["slug"], defaults=pdata)
    created_plans[plan.slug] = plan
print(f"✅ Subscription Plans ready: {len(created_plans)} plans")

# 2. Link Organizations to Subscriptions
orgs = list(Organization.objects.all())
for i, org in enumerate(orgs):
    plan = created_plans["growth-pro"] if i % 2 == 0 else created_plans["free-tier"]
    OrganizationSubscription.objects.get_or_create(
        organization=org,
        defaults={
            "plan": plan,
            "status": OrganizationSubscription.Status.ACTIVE,
            "expires_at": timezone.now() + timedelta(days=365),
            "auto_renew": True,
        }
    )
print(f"✅ Organization Subscriptions assigned for {len(orgs)} organizations")

# 3. Ensure Staff users & Staff records
staff_data = [
    {"email": "ramesh.caretaker@erentkarar.com", "name": "Ramesh Patel", "role": User.RoleChoices.PROPERTY_MANAGER, "designation": "Head Property Manager", "salary": Decimal("28000")},
    {"email": "mukesh.electrician@erentkarar.com", "name": "Mukesh Sharma", "role": User.RoleChoices.MAINTENANCE_STAFF, "designation": "Facility Electrician & Plumber", "salary": Decimal("20000")},
    {"email": "sunita.housekeeping@erentkarar.com", "name": "Sunita Ben", "role": User.RoleChoices.HOUSEKEEPING, "designation": "Housekeeping Supervisor", "salary": Decimal("16000")},
    {"email": "kavita.reception@erentkarar.com", "name": "Kavita Shah", "role": User.RoleChoices.RECEPTIONIST, "designation": "Front Desk & Booking Coordinator", "salary": Decimal("22000")},
    {"email": "suresh.security@erentkarar.com", "name": "Suresh Singh", "role": User.RoleChoices.SECURITY, "designation": "Night Security Guard", "salary": Decimal("18000")},
    {"email": "jignesh.mess@erentkarar.com", "name": "Jignesh Maharaj", "role": User.RoleChoices.MESS_MANAGER, "designation": "Head Chef & Mess In-charge", "salary": Decimal("25000")},
]

created_staff_users = []
if orgs:
    primary_org = orgs[0]
    for sd in staff_data:
        u, _ = User.objects.get_or_create(
            email=sd["email"],
            defaults={
                "first_name": sd["name"].split()[0],
                "last_name": sd["name"].split()[-1],
                "role": sd["role"],
                "is_staff": True,
                "is_active": True,
                "is_verified": True,
            }
        )
        u.set_password("admin")
        u.is_staff = True
        u.save()
        created_staff_users.append(u)

        staff_record, _ = Staff.objects.get_or_create(
            user=u,
            defaults={
                "organization": primary_org,
                "designation": sd["designation"],
                "monthly_salary": sd["salary"],
                "shift_timings": "08:00 AM - 08:00 PM" if "Security" in sd["designation"] else "09:00 AM - 06:00 PM",
                "is_active": True,
            }
        )
print(f"✅ Staff records and profiles configured: {len(created_staff_users)} staff members")

# 4. Create sample tenants & active tenancies
tenant_data = [
    {"email": "priya.sharma@gmail.com", "name": "Priya Sharma", "phone": "9825011111", "city": "Ahmedabad"},
    {"email": "rohit.verma@gmail.com", "name": "Rohit Verma", "phone": "9825022222", "city": "Ahmedabad"},
    {"email": "ananya.patel@gmail.com", "name": "Ananya Patel", "phone": "9825033333", "city": "Vadodara"},
    {"email": "kartik.desai@gmail.com", "name": "Kartik Desai", "phone": "9825044444", "city": "Surat"},
    {"email": "megha.joshi@gmail.com", "name": "Megha Joshi", "phone": "9825055555", "city": "Gandhinagar"},
    {"email": "chirag.trivedi@gmail.com", "name": "Chirag Trivedi", "phone": "9825066666", "city": "Ahmedabad"},
]

created_tenants = []
for td in tenant_data:
    t_user, _ = User.objects.get_or_create(
        email=td["email"],
        defaults={
            "first_name": td["name"].split()[0],
            "last_name": td["name"].split()[-1],
            "phone_number": td["phone"],
            "role": User.RoleChoices.TENANT,
            "is_active": True,
            "is_verified": True,
        }
    )
    t_user.set_password("admin")
    t_user.save()
    created_tenants.append(t_user)

    # Add KYC
    kyc, _ = KYC.objects.get_or_create(
        user=t_user,
        defaults={
            "status": KYC.KYCStatus.VERIFIED,
            "verified_at": timezone.now(),
        }
    )
    KYCDocument.objects.get_or_create(
        kyc=kyc,
        document_type=KYCDocument.DocumentType.AADHAAR_FRONT,
        defaults={
            "masked_document_number": "XXXX-XXXX-8921",
            "is_verified": True,
        }
    )
print(f"✅ Tenants with KYC created: {len(created_tenants)} tenants")

# 5. Populate Tenancies, Invoices, Deposits, Complaints, Payments
available_beds = list(Bed.objects.select_related("room__floor__building__property").all()[:10])
created_tenancies = []

for i, tenant in enumerate(created_tenants):
    if i < len(available_beds):
        bed = available_beds[i]
        room = bed.room
        prop = room.floor.building.property

        tenancy, created = Tenancy.objects.get_or_create(
            tenant=tenant,
            property=prop,
            defaults={
                "room": room,
                "bed": bed,
                "start_date": date(2026, 1, 1),
                "end_date": date(2026, 12, 31),
                "monthly_rent": bed.rent_amount or Decimal("8500.00"),
                "security_deposit_paid": bed.deposit_amount or Decimal("17000.00"),
                "status": Tenancy.TenancyStatus.ACTIVE,
            }
        )
        created_tenancies.append(tenancy)

        # Mark bed occupied
        bed.status = Bed.BedStatus.OCCUPIED
        bed.save()

        # Move-in record
        MoveIn.objects.get_or_create(
            tenancy=tenancy,
            defaults={
                "actual_move_in_date": date(2026, 1, 1),
                "meter_reading_electricity": Decimal("1045.50") + Decimal(i * 50),
                "keys_handed_over": True,
                "room_condition_notes": "All room furnishings inspected and in pristine condition.",
                "verified_by_staff": "Ramesh Patel (Manager)",
            }
        )

        # Security Deposit
        sec_dep, _ = SecurityDeposit.objects.get_or_create(
            tenancy=tenancy,
            defaults={
                "amount_total": tenancy.security_deposit_paid,
                "amount_collected": tenancy.security_deposit_paid,
                "status": SecurityDeposit.DepositStatus.HELD,
                "collected_date": date(2026, 1, 1),
            }
        )

        # Invoices for Feb and March 2026
        for month, status, paid in [
            (2, Invoice.InvoiceStatus.PAID, tenancy.monthly_rent),
            (3, Invoice.InvoiceStatus.ISSUED, Decimal("0.00"))
        ]:
            inv, _ = Invoice.objects.get_or_create(
                tenancy=tenancy,
                billing_month=month,
                billing_year=2026,
                defaults={
                    "base_rent": tenancy.monthly_rent,
                    "maintenance_charges": Decimal("500.00"),
                    "electricity_charges": Decimal("450.00"),
                    "water_charges": Decimal("0.00"),
                    "mess_charges": Decimal("2500.00"),
                    "late_fee": Decimal("0.00"),
                    "total_amount": tenancy.monthly_rent + Decimal("3450.00"),
                    "paid_amount": (tenancy.monthly_rent + Decimal("3450.00")) if status == Invoice.InvoiceStatus.PAID else Decimal("0.00"),
                    "due_date": date(2026, month, 5),
                    "status": status,
                }
            )

            InvoiceItem.objects.get_or_create(
                invoice=inv,
                title=f"Monthly Room Rent - Month {month}/2026",
                defaults={"amount": tenancy.monthly_rent, "category": "RENT"}
            )
            InvoiceItem.objects.get_or_create(
                invoice=inv,
                title="Common Maintenance & Housekeeping",
                defaults={"amount": Decimal("500.00"), "category": "MAINTENANCE"}
            )
            InvoiceItem.objects.get_or_create(
                invoice=inv,
                title="Sub-meter Electricity (45 units @ ₹10)",
                defaults={"amount": Decimal("450.00"), "category": "UTILITY"}
            )

            # Payment record if paid
            if status == Invoice.InvoiceStatus.PAID:
                pay, _ = Payment.objects.get_or_create(
                    tenancy=tenancy,
                    invoice=inv,
                    defaults={
                        "organization": prop.organization,
                        "amount": inv.total_amount,
                        "payment_type": Payment.PaymentType.RENT,
                        "payment_method": Payment.PaymentMethod.UPI,
                        "status": Payment.PaymentStatus.SUCCESS,
                        "gateway_name": "RAZORPAY",
                        "gateway_order_id": f"order_{uuid.uuid4().hex[:10]}",
                        "gateway_payment_id": f"pay_{uuid.uuid4().hex[:12]}",
                        "is_reconciled": True,
                        "reconciled_at": timezone.now(),
                    }
                )
                PaymentAttempt.objects.get_or_create(
                    payment=pay,
                    provider_event_id=f"evt_{uuid.uuid4().hex[:10]}",
                    defaults={
                        "response_code": "200_SUCCESS",
                        "is_verified": True,
                        "raw_payload": {"status": "captured", "method": "upi", "vpa": "tenant@okhdfcbank"}
                    }
                )

        # Electricity readings
        ElectricityReading.objects.get_or_create(
            property=prop,
            room=room,
            meter_number=f"MTR-{room.room_number}",
            reading_date=date(2026, 3, 1),
            defaults={
                "previous_reading": Decimal("1045.00"),
                "current_reading": Decimal("1095.50"),
                "rate_per_unit": Decimal("10.00"),
            }
        )

print(f"✅ Tenancies, Invoices, Deposits, Payments & Meter readings populated: {len(created_tenancies)} tenancies")

# 6. Seed Mess Plans, Menus & Attendance
for prop in Property.objects.all()[:4]:
    plan1, _ = MessPlan.objects.get_or_create(
        property=prop,
        name="Unlimited 3-Meals Veg & Non-Veg",
        defaults={
            "monthly_price": Decimal("3500.00"),
            "description": "Daily Breakfast, Lunch, and Dinner with Weekend Special Biryani & Sweets.",
            "is_active": True,
        }
    )
    plan2, _ = MessPlan.objects.get_or_create(
        property=prop,
        name="Standard 2-Meals Gujarati Thali",
        defaults={
            "monthly_price": Decimal("2500.00"),
            "description": "Homely Breakfast and Dinner including Roti, Sabzi, Dal, Rice, Salad & Chaas.",
            "is_active": True,
        }
    )

if created_tenancies:
    for day in range(1, 8):
        MealAttendance.objects.get_or_create(
            tenancy=created_tenancies[0],
            meal_date=date(2026, 3, day),
            meal_type=MealAttendance.MealType.DINNER,
            defaults={"is_opted_out": (day == 5)}
        )
print("✅ Mess plans and meal attendance populated")

# 7. Seed Complaints and Maintenance Tickets
complaint_samples = [
    {"category": Complaint.ComplaintCategory.PLUMBING, "urgency": Complaint.Urgency.HIGH, "title": "Bathroom geyser not heating water", "status": Complaint.ComplaintStatus.IN_PROGRESS, "cost": Decimal("450.00"), "vendor": "Shreeji Electricals"},
    {"category": Complaint.ComplaintCategory.WIFI, "urgency": Complaint.Urgency.MEDIUM, "title": "2nd Floor WiFi signal weak in room 204", "status": Complaint.ComplaintStatus.RESOLVED, "cost": Decimal("250.00"), "vendor": "GTPL Broadband Tech"},
    {"category": Complaint.ComplaintCategory.CARPENTRY, "urgency": Complaint.Urgency.LOW, "title": "Study table drawer handle loose", "status": Complaint.ComplaintStatus.CLOSED, "cost": Decimal("150.00"), "vendor": "Ganesh Carpentry"},
    {"category": Complaint.ComplaintCategory.CLEANING, "urgency": Complaint.Urgency.MEDIUM, "title": "Balcony deep cleaning request before festive weekend", "status": Complaint.ComplaintStatus.OPEN, "cost": Decimal("0.00"), "vendor": "Internal Housekeeping"},
]

for i, cs in enumerate(complaint_samples):
    if i < len(created_tenancies):
        t = created_tenancies[i]
        c, _ = Complaint.objects.get_or_create(
            tenancy=t,
            title=cs["title"],
            defaults={
                "organization": t.property.organization,
                "property": t.property,
                "category": cs["category"],
                "urgency": cs["urgency"],
                "description": f"Reported issue: {cs['title']} by tenant {t.tenant.first_name}.",
                "status": cs["status"],
                "assigned_staff": created_staff_users[1] if len(created_staff_users) > 1 else None,
            }
        )
        if cs["cost"] > 0:
            MaintenanceTicket.objects.get_or_create(
                complaint=c,
                defaults={
                    "vendor_name": cs["vendor"],
                    "vendor_phone": "9876543210",
                    "estimated_cost": cs["cost"],
                    "actual_cost": cs["cost"],
                }
            )
print("✅ Complaints & Maintenance Tickets populated")

# 8. Seed Visitors
if created_tenancies and created_staff_users:
    guard_user = next((u for u in created_staff_users if u.role == User.RoleChoices.SECURITY), created_staff_users[0])
    visitors_data = [
        {"name": "Mahesh Sharma", "phone": "9898011223", "rel": "Father", "status": Visitor.VisitorStatus.CHECKED_OUT},
        {"name": "Kunal Mehta", "phone": "9898044556", "rel": "Friend", "status": Visitor.VisitorStatus.APPROVED},
        {"name": "Deepak Patel", "phone": "9898077889", "rel": "Colleague", "status": Visitor.VisitorStatus.CHECKED_IN},
    ]
    for vd in visitors_data:
        Visitor.objects.get_or_create(
            tenancy=created_tenancies[0],
            visitor_name=vd["name"],
            defaults={
                "visitor_phone": vd["phone"],
                "relation": vd["rel"],
                "purpose": "Personal Visit & Luggage Handover",
                "expected_arrival": timezone.now() - timedelta(hours=3),
                "check_in_time": timezone.now() - timedelta(hours=2) if vd["status"] in [Visitor.VisitorStatus.CHECKED_IN, Visitor.VisitorStatus.CHECKED_OUT] else None,
                "check_out_time": timezone.now() - timedelta(minutes=30) if vd["status"] == Visitor.VisitorStatus.CHECKED_OUT else None,
                "status": vd["status"],
                "security_guard": guard_user,
            }
        )
print("✅ Visitor gate pass records populated")

# 9. Seed Leads & Property Visits
if orgs:
    leads_data = [
        {"name": "Hardik Shah", "phone": "9924011223", "email": "hardik.s@gmail.com", "budget": Decimal("9000"), "loc": "Navrangpura, Ahmedabad", "status": Lead.LeadStatus.VISIT_SCHEDULED},
        {"name": "Pooja Trivedi", "phone": "9924033445", "email": "pooja.t@gmail.com", "budget": Decimal("7500"), "loc": "Satellite, Ahmedabad", "status": Lead.LeadStatus.CONTACTED},
        {"name": "Sanjay Rathod", "phone": "9924055667", "email": "sanjay.r@gmail.com", "budget": Decimal("12000"), "loc": "Karelibaug, Vadodara", "status": Lead.LeadStatus.BOOKED},
    ]
    properties_list = list(Property.objects.all())
    for i, ld in enumerate(leads_data):
        lead_prop = properties_list[i % len(properties_list)] if properties_list else None
        lead, _ = Lead.objects.get_or_create(
            phone=ld["phone"],
            defaults={
                "organization": orgs[0],
                "property": lead_prop,
                "name": ld["name"],
                "email": ld["email"],
                "source": Lead.LeadSource.MARKETPLACE,
                "budget": ld["budget"],
                "preferred_location": ld["loc"],
                "status": ld["status"],
                "assigned_staff": created_staff_users[0] if created_staff_users else None,
                "notes": "Looking for single occupancy room with food and AC."
            }
        )
        LeadActivity.objects.get_or_create(
            lead=lead,
            note="Spoke with client on phone. Interested in visiting this weekend.",
            defaults={
                "user": created_staff_users[0] if created_staff_users else None,
                "activity_type": LeadActivity.ActivityType.CALL,
            }
        )
        if lead_prop:
            Visit.objects.get_or_create(
                lead=lead,
                property=lead_prop,
                defaults={
                    "scheduled_at": timezone.now() + timedelta(days=2),
                    "status": Visit.VisitStatus.SCHEDULED,
                    "assigned_staff": created_staff_users[0] if created_staff_users else None,
                    "feedback": "Confirmed on WhatsApp.",
                }
            )
print("✅ Leads, Activities & Visits populated")

# 10. Seed Bookings
if orgs and properties_list:
    Booking.objects.get_or_create(
        tenant_phone="9924055667",
        defaults={
            "organization": orgs[0],
            "property": properties_list[0],
            "tenant_name": "Sanjay Rathod",
            "tenant_email": "sanjay.r@gmail.com",
            "move_in_date": date(2026, 4, 1),
            "token_amount": Decimal("2000.00"),
            "monthly_rent": Decimal("8500.00"),
            "security_deposit": Decimal("17000.00"),
            "status": Booking.BookingStatus.CONFIRMED,
            "special_requests": "Requires top floor corner room with fast WiFi.",
        }
    )
print("✅ Bookings populated")

# 11. Seed Referral System
if created_tenants:
    ref_user = created_tenants[0]
    ref_code, _ = ReferralCode.objects.get_or_create(
        user=ref_user,
        defaults={
            "code": "PRIYA2026",
            "total_clicks": 18,
            "total_signups": 4,
            "total_converted_orgs": 1,
        }
    )
    if len(created_tenants) > 1:
        referred = created_tenants[1]
        referral, _ = Referral.objects.get_or_create(
            referred_user=referred,
            defaults={
                "referrer": ref_user,
                "code_used": ref_code,
                "status": Referral.ReferralStatus.REWARDED,
            }
        )
        ReferralReward.objects.get_or_create(
            referral=referral,
            defaults={
                "reward_type": ReferralReward.RewardType.CREDIT,
                "amount": Decimal("500.00"),
                "status": ReferralReward.RewardStatus.APPROVED,
                "notes": "Credited ₹500 discount on April 2026 rent invoice.",
            }
        )
print("✅ Referral codes & rewards populated")

# 12. Seed Notifications & Communication Logs
if created_tenants:
    Notification.objects.get_or_create(
        user=created_tenants[0],
        title="March 2026 Rent Invoice Generated",
        defaults={
            "category": Notification.NotificationCategory.RENT,
            "message": "Your monthly rent invoice of ₹11,950 for March 2026 has been generated. Due date: 5th March.",
            "action_url": "/dashboard/invoices",
            "is_read": False,
        }
    )
    Notification.objects.get_or_create(
        user=created_tenants[0],
        title="Visitor Gate Pass Approved",
        defaults={
            "category": Notification.NotificationCategory.VISITOR,
            "message": "Visitor Kunal Mehta has been pre-approved for entry today.",
            "action_url": "/tenant/visitors",
            "is_read": True,
        }
    )
    CommunicationLog.objects.get_or_create(
        recipient=created_tenants[0].phone_number or "9825011111",
        channel=CommunicationLog.Channel.WHATSAPP,
        template_name="rent_invoice_reminder_v2",
        defaults={
            "organization": orgs[0] if orgs else None,
            "message_content": "Dear Priya Sharma, your rent invoice for March 2026 is due on 05-Mar-2026. Pay securely via UPI link: https://erentkarar.com/pay/inv-123",
            "status": CommunicationLog.Status.DELIVERED,
            "provider_message_id": f"wamid.{uuid.uuid4().hex}",
        }
    )
print("✅ Notifications & WhatsApp Communication Logs populated")

# 13. Seed Agreement Templates
gj_state = StateConfiguration.objects.filter(state_code="GJ").first()
AgreementTemplate.objects.get_or_create(
    name="Standard Gujarat 11-Month Residential Tenancy Agreement",
    defaults={
        "state": gj_state,
        "template_text": "STANDARD GUJARAT TENANCY CONTRACT (Model Tenancy Act 2021 Compliant)\nBetween Landlord: {{owner_name}} and Tenant: {{tenant_name}} for Premises: {{property_address}} at Monthly Rent: ₹{{monthly_rent}} and Deposit: ₹{{deposit}}.",
        "is_default": True,
    }
)
AgreementTemplate.objects.get_or_create(
    name="Commercial Office & Retail Space Lease Agreement",
    defaults={
        "state": gj_state,
        "template_text": "COMMERCIAL LEASE AGREEMENT\nBetween Lessor: {{owner_name}} and Lessee: {{tenant_name}} for Commercial Unit: {{property_address}} at Monthly Rent: ₹{{monthly_rent}}.",
        "is_default": False,
    }
)
print("✅ Agreement Templates populated")

print("\n🎉 Comprehensive Rental OS Database Seeding Finished Successfully!")
