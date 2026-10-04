import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "erentkarar.settings")
django.setup()

from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.properties.models import Property

def test_full_admin_listing_approval_flow():
    print("=== STARTING PROPERTY LISTING & ADMIN APPROVAL FLOW TEST ===")
    client = APIClient()

    # 1. Submit property via Public Listing Form (e.g. PG / Hostel / Flat owner)
    payload = {
        "title": "Krishna Shivalik Luxury PG for Students",
        "property_type": "PG",
        "gender_preference": "MALE",
        "city": "Vadodara",
        "locality": "Sayajigunj",
        "address": "Opposite Railway Station, Sayajigunj, Vadodara",
        "nearest_landmark": "Vadodara Central Bus Station",
        "monthly_rent": 7500,
        "security_deposit": 15000,
        "total_beds": 12,
        "amenities": ["wifi", "food", "security"],
        "owner_name": "Rameshbhai Patel",
        "owner_phone": "9825012345",
        "owner_email": "ramesh.pg@example.com",
    }

    res = client.post("/api/v1/marketplace/list-property/", data=payload, format="json")
    assert res.status_code == 201, f"Failed to submit: {res.data}"
    prop_id = res.data["data"]["id"]
    prop_slug = res.data["data"]["slug"]
    print(f"1. Property submitted successfully: ID={prop_id}, Slug={prop_slug}")

    # Verify initial database state
    prop = Property.objects.get(id=prop_id)
    assert prop.verification_status == Property.VerificationStatus.PENDING, f"Expected PENDING, got {prop.verification_status}"
    assert prop.is_published is False, f"Expected is_published=False, got {prop.is_published}"
    print(f"2. Verified DB initial state: verification_status={prop.verification_status}, is_published={prop.is_published}")

    # 2. Check that it is NOT in the public marketplace search
    search_res = client.get("/api/v1/marketplace/search/?city=Vadodara")
    all_search_ids = [p["id"] for p in search_res.data["data"]]
    assert str(prop.id) not in all_search_ids, "ERROR: Unapproved pending property appeared in marketplace search!"
    print("3. Verified pending property is HIDDEN from public marketplace search.")

    # 3. Check that public detail view blocks unapproved listing
    detail_res = client.get(f"/api/v1/marketplace/property/{prop_slug}/")
    assert detail_res.status_code in [403, 404], f"Expected 403 or 404, got {detail_res.status_code}"
    print(f"4. Verified public detail view blocks unapproved listing (Status: {detail_res.status_code}).")

    # 4. Attempt toggle_publish by non-admin or before approval -> should be blocked
    owner_user = prop.organization.members.first().user
    client.force_authenticate(user=owner_user)
    toggle_res = client.post(f"/api/v1/properties/{prop.id}/toggle_publish/")
    assert toggle_res.status_code == 400, f"Expected 400 error on publishing unverified property, got {toggle_res.status_code}"
    print("5. Verified landlord CANNOT publish property before admin approval.")

    # 5. Admin logs in and approves property
    admin_user = User.objects.filter(role=User.RoleChoices.SUPER_ADMIN).first()
    if not admin_user:
        admin_user = User.objects.create_superuser(email="admin@erentkarar.com", password="Admin@12345")
    
    client.force_authenticate(user=admin_user)
    approve_res = client.post(f"/api/v1/properties/{prop.id}/approve/", data={"notes": "Approved after reviewing ownership documents"})
    assert approve_res.status_code == 200, f"Failed to approve: {approve_res.data}"
    print("6. Admin successfully approved property listing.")

    # Verify DB state after approval
    prop.refresh_from_db()
    assert prop.verification_status == Property.VerificationStatus.VERIFIED, f"Expected VERIFIED, got {prop.verification_status}"
    assert prop.is_published is True, f"Expected is_published=True, got {prop.is_published}"
    print(f"7. Verified DB state after approval: verification_status={prop.verification_status}, is_published={prop.is_published}")

    # 6. Check that it is NOW VISIBLE in public marketplace search!
    client.force_authenticate(user=None)
    search_res_2 = client.get("/api/v1/marketplace/search/?city=Vadodara")
    all_search_ids_2 = [p["id"] for p in search_res_2.data["data"]]
    assert str(prop.id) in all_search_ids_2, "ERROR: Approved property did not appear in marketplace search!"
    print("8. Verified approved property is NOW LIVE on public marketplace search!")

    # 7. Check that public detail view now works
    detail_res_2 = client.get(f"/api/v1/marketplace/property/{prop_slug}/")
    assert detail_res_2.status_code == 200, f"Expected 200, got {detail_res_2.status_code}"
    assert detail_res_2.data["data"]["title"] == "Krishna Shivalik Luxury PG for Students"
    print("9. Verified public detail page is live and accessible!")

    # Clean up test property
    prop.delete()
    print("10. Test cleanup completed.")
    print("=== ALL PROPERTY LISTING & ADMIN APPROVAL TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    test_full_admin_listing_approval_flow()
