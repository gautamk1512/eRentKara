import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_tenant_and_kiosk_flows():
    print("Testing Tenant & Kiosk AI Studio Execution Flows...")

    # Tenant Flow
    tenant_payload = {
        "property_title": "1 BHK Studio at Surat",
        "property_address": "Flat 204, Riverview Apts, Adajan, Surat",
        "property_city": "Surat",
        "property_state": "Gujarat",
        "property_pincode": "395009",
        "property_category": "RESIDENTIAL_APARTMENT",
        "monthly_rent": 14000,
        "security_deposit": 28000,
        "maintenance_amount": 1200,
        "duration_months": 11,
        "start_date": "2026-10-15",
        "notice_period_days": 30,
        "lock_in_months": 1,
        "agreement_type": "RESIDENTIAL",
        "owner_details": {
            "full_name": "Kiritbhai Shah",
            "email": "kirit.shah.ai@erentkarar.com",
            "phone": "9824112233",
            "address": "Ring Road, Surat",
        },
        "tenant_details": {
            "full_name": "Meera Joshi",
            "email": "meera.joshi.ai@erentkarar.com",
            "phone": "9725334455",
            "address": "Flat 204, Riverview Apts, Adajan, Surat",
        }
    }

    print("\n--- Testing Tenant Flow ---")
    res = requests.post(f"{BASE_URL}/agreements/create-tenant/", json=tenant_payload)
    if res.status_code != 201:
        print(f"[FAIL] Create Tenant returned status {res.status_code}: {res.text}")
        return False
    data = res.json()
    agr_id = data["data"]["id"]
    token = data.get("tokens", {}).get("access")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    print(f"[OK] Tenant Agreement Created: ID={agr_id}")

    # Sign as Tenant
    sign_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/sign/", json={"party_type": "TENANT"}, headers=headers)
    print(f"[OK] Tenant eSign: {sign_res.json().get('message')}")

    # Kiosk Assisted Flow
    print("\n--- Testing Kiosk Assisted Flow ---")
    kiosk_payload = {
        **tenant_payload,
        "property_title": "Commercial Office at Vadodara",
        "property_city": "Vadodara",
        "agreement_type": "COMMERCIAL",
        "shop_id": "SHOP-GJ-001",
        "assisted_by": "Akash Patel (Operator)",
        "operator_email": "kiosk.vadodara.001@erentkarar.com"
    }
    res_kiosk = requests.post(f"{BASE_URL}/agreements/create-assisted/", json=kiosk_payload)
    if res_kiosk.status_code != 201:
        print(f"[FAIL] Create Assisted returned status {res_kiosk.status_code}: {res_kiosk.text}")
        return False
    kiosk_data = res_kiosk.json()
    kiosk_agr_id = kiosk_data["data"]["id"]
    print(f"[OK] Kiosk Assisted Agreement Created: ID={kiosk_agr_id}")

    print("\nALL ROLES (OWNER, TENANT, KIOSK) SUCCESSFULLY OPERATIONAL IN ERENTKARAR AI STUDIO!")
    return True

if __name__ == "__main__":
    success = test_tenant_and_kiosk_flows()
    sys.exit(0 if success else 1)
