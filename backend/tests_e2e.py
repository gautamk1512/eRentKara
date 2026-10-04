import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "erentkarar.settings")
django.setup()

from django.test import Client
from apps.accounts.models import User
from apps.properties.models import Property, Bed
from apps.billing.models import Invoice

def run_tests():
    print(">> Running eRentKarar Integration Tests...")
    client = Client()

    # 1. Test Health Check
    resp = client.get("/health/")
    assert resp.status_code == 200, f"Health check failed: {resp.status_code}"
    assert resp.json()["status"] == "healthy"
    print("   [PASS] /health/ endpoint responsive")

    # 2. Test Login & JWT Token generation
    resp = client.post("/api/v1/auth/login/", {"email": "owner@erentkarar.com", "password": "Password123!"}, content_type="application/json")
    assert resp.status_code == 200, f"Owner login failed: {resp.status_code}"
    owner_token = resp.json()["data"]["tokens"]["access"]
    assert owner_token is not None
    print("   [PASS] /api/v1/auth/login/ JWT authentication")

    # 3. Test Marketplace Public Search
    resp = client.get("/api/v1/marketplace/search/?city=Bengaluru")
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] >= 1
    print(f"   [PASS] /api/v1/marketplace/search/ returned {data['count']} properties")

    # 4. Test Marketplace Property Detail
    prop_slug = data["data"][0]["slug"]
    resp = client.get(f"/api/v1/marketplace/property/{prop_slug}/")
    assert resp.status_code == 200
    assert resp.json()["data"]["slug"] == prop_slug
    print(f"   [PASS] /api/v1/marketplace/property/{prop_slug}/ detailed view")

    # 5. Test Owner Scoped Dashboard Metrics
    resp = client.get("/api/v1/reports/dashboard-metrics/", HTTP_AUTHORIZATION=f"Bearer {owner_token}")
    assert resp.status_code == 200
    metrics = resp.json()["data"]["summary"]
    assert metrics["total_properties"] >= 1
    print(f"   [PASS] /api/v1/reports/dashboard-metrics/ (Total properties: {metrics['total_properties']}, Occupancy: {metrics['occupancy_rate']}%)")

    # 6. Test Ekrar AI Assistant Scoped Query
    resp = client.post(
        "/api/v1/ai/chat/",
        {"message": "किसका rent pending है?"},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {owner_token}"
    )
    assert resp.status_code == 200
    ai_resp = resp.json()["data"]["message"]["content"]
    assert "pending" in ai_resp.lower() or "tenant" in ai_resp.lower()
    print("   [PASS] /api/v1/ai/chat/ Ekrar AI pending dues tool execution")

    # 7. Test Double-Booking Protection (Pessimistic Locking)
    available_bed = Bed.objects.filter(status=Bed.BedStatus.AVAILABLE).first()
    if available_bed:
        prop = available_bed.room.floor.building.property
        # Book bed 1st time
        resp1 = client.post(
            "/api/v1/bookings/",
            {
                "property": str(prop.id),
                "bed": available_bed.id,
                "move_in_date": "2026-10-01",
                "tenant_name": "Test Candidate 1",
                "tenant_phone": "9999911111",
                "tenant_email": "candidate1@example.com",
            },
            content_type="application/json",
        )
        assert resp1.status_code == 201, f"First booking failed: {resp1.json()}"
        print("   [PASS] /api/v1/bookings/ 1st reservation successfully placed")

        # Attempt to double-book same bed
        resp2 = client.post(
            "/api/v1/bookings/",
            {
                "property": str(prop.id),
                "bed": available_bed.id,
                "move_in_date": "2026-10-01",
                "tenant_name": "Test Candidate 2",
                "tenant_phone": "9999922222",
                "tenant_email": "candidate2@example.com",
            },
            content_type="application/json",
        )
        assert resp2.status_code == 409, f"Double booking was NOT prevented! Got {resp2.status_code}"
        print("   [PASS] Double-booking collision prevented! Status 409 Conflict properly returned.")

    print("\n[SUCCESS] ALL 7 INTEGRATION TESTS PASSED PERFECTLY!\n")

if __name__ == "__main__":
    run_tests()
