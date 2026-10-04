import requests
import sys

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000/api/v1"

def print_header(title):
    print(f"\n{'='*75}\n>>> {title}\n{'='*75}")

def test_owner_flow():
    print_header("TEST 1: OWNER (LANDLORD) COMPLETE E2E WORKFLOW")

    # 1. Login
    login_res = requests.post(f"{BASE_URL}/auth/login/", json={
        "email": "owner@erentkarar.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200, f"Owner login failed: {login_res.text}"
    token = login_res.json()["data"]["tokens"]["access"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print("[OK] Owner Authenticated. Token acquired.")

    # 2. Form submission -> DB persistence
    payload = {
        "property_title": "Shivalik 3BHK Penthouse",
        "property_address": "P-101, Shivalik Highstreet, SG Highway, Ahmedabad",
        "property_city": "Ahmedabad",
        "property_state": "Gujarat",
        "property_pincode": "380015",
        "property_category": "3BHK Flat",
        "monthly_rent": 28000,
        "security_deposit": 56000,
        "maintenance_amount": 2500,
        "duration_months": 11,
        "start_date": "2026-11-01",
        "notice_period_days": 30,
        "lock_in_months": 6,
        "agreement_type": "RESIDENTIAL",
        "owner_details": {
            "full_name": "Rajeshbhai K. Patel",
            "email": "owner@erentkarar.com",
            "phone": "9825012345",
            "address": "P-101, Shivalik Highstreet, Ahmedabad",
        },
        "tenant_details": {
            "full_name": "Sunil Verma",
            "email": "sunil.verma@gmail.com",
            "phone": "9898012345",
            "address": "Navrangpura, Ahmedabad",
        }
    }
    create_res = requests.post(f"{BASE_URL}/agreements/create-owner/", json=payload, headers=headers)
    assert create_res.status_code == 201, f"Owner agreement creation failed: {create_res.text}"
    agr = create_res.json()["data"]
    agr_id = agr["id"]
    print(f"[OK] Owner Agreement created in Database: #{agr['agreement_number']} (UUID: {agr_id})")
    print(f"     Creator: {agr['creator_type']} | Status: {agr['status']} | Stamp Duty: Rs. {agr['stamp_duty_amount']}")

    # 3. Aadhaar Verification
    v_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/verify-identity/", json={
        "party_type": "OWNER",
        "aadhaar_number": "999988887777",
        "otp_code": "123456"
    })
    assert v_res.status_code == 200, f"Owner Aadhaar failed: {v_res.text}"
    print(f"[OK] Owner UIDAI Aadhaar Verification Saved: {v_res.json()['message']}")

    # 4. Digital eSign
    s_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/sign/", json={"sign_both": True})
    assert s_res.status_code == 200, f"Owner sign failed: {s_res.text}"
    print(f"[OK] Digital Signatures cryptographically recorded: {s_res.json()['message']}")

    # 5. e-Stamping
    stamp_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/stamp/")
    assert stamp_res.status_code == 200, f"Owner stamp failed: {stamp_res.text}"
    stamped_data = stamp_res.json()["data"]
    print(f"[OK] Government e-Stamping Processed:")
    print(f"     Certificate Number: {stamped_data.get('stamp_certificate_number')}")
    print(f"     SHA-256 Hash: {stamped_data.get('document_hash')}")
    print(f"     Final Status: {stamped_data.get('status')}")

    # 6. PDF Download
    pdf_res = requests.get(f"{BASE_URL}/agreements/{agr_id}/download-pdf/")
    assert pdf_res.status_code == 200 and len(pdf_res.content) > 1000, "PDF download failed"
    print(f"[OK] Final Executed PDF Downloaded: {len(pdf_res.content)} bytes.")


def test_tenant_flow():
    print_header("TEST 2: TENANT (RENTER) COMPLETE E2E WORKFLOW")

    # 1. Login / Google Auth
    g_res = requests.post(f"{BASE_URL}/auth/google/", json={
        "email": "amit.tenant.direct@erentkarar.com",
        "name": "Amit Shah Tenant",
        "role": "TENANT",
        "force_role": True,
    })
    assert g_res.status_code == 200, f"Tenant Google auth failed: {g_res.text}"
    token = g_res.json()["data"]["tokens"]["access"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print("[OK] Tenant Authenticated via Google. Role: TENANT. Token acquired.")

    # 2. Form submission -> DB persistence
    payload = {
        "property_title": "Surat Co-Living 1BHK",
        "property_address": "Flat 304, Vesu Central, Surat, Gujarat",
        "property_city": "Surat",
        "property_state": "Gujarat",
        "property_pincode": "395007",
        "property_category": "1BHK Unit",
        "monthly_rent": 14000,
        "security_deposit": 28000,
        "maintenance_amount": 1200,
        "duration_months": 11,
        "start_date": "2026-11-15",
        "notice_period_days": 30,
        "lock_in_months": 3,
        "agreement_type": "RESIDENTIAL",
        "owner_details": {
            "full_name": "Manishbhai Desai",
            "email": "manish.desai@gmail.com",
            "phone": "9825199999",
            "address": "Vesu, Surat",
        },
        "tenant_details": {
            "full_name": "Amit Shah Tenant",
            "email": "amit.tenant.direct@erentkarar.com",
            "phone": "9825067890",
            "address": "Surat, Gujarat",
        }
    }
    create_res = requests.post(f"{BASE_URL}/agreements/create-tenant/", json=payload, headers=headers)
    assert create_res.status_code == 201, f"Tenant agreement creation failed: {create_res.text}"
    agr = create_res.json()["data"]
    agr_id = agr["id"]
    print(f"[OK] Tenant Agreement created in Database: #{agr['agreement_number']} (UUID: {agr_id})")
    print(f"     Creator: {agr['creator_type']} | Status: {agr['status']}")

    # 3. Aadhaar Verification
    v_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/verify-identity/", json={
        "party_type": "TENANT",
        "aadhaar_number": "123456789012",
        "otp_code": "123456"
    })
    assert v_res.status_code == 200, f"Tenant Aadhaar failed: {v_res.text}"
    print(f"[OK] Tenant UIDAI Aadhaar Verification Saved: {v_res.json()['message']}")

    # 4. Digital eSign
    s_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/sign/", json={"sign_both": True})
    assert s_res.status_code == 200, f"Tenant sign failed: {s_res.text}"
    print(f"[OK] Digital Signatures recorded: {s_res.json()['message']}")

    # 5. e-Stamping
    stamp_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/stamp/")
    assert stamp_res.status_code == 200, f"Tenant stamp failed: {stamp_res.text}"
    stamped_data = stamp_res.json()["data"]
    print(f"[OK] Government e-Stamping Processed:")
    print(f"     Certificate Number: {stamped_data.get('stamp_certificate_number')}")
    print(f"     Final Status: {stamped_data.get('status')}")

    # 6. PDF Download
    pdf_res = requests.get(f"{BASE_URL}/agreements/{agr_id}/download-pdf/")
    assert pdf_res.status_code == 200 and len(pdf_res.content) > 1000, "PDF download failed"
    print(f"[OK] Tenant Final Executed PDF Downloaded: {len(pdf_res.content)} bytes.")


def test_shopkeeper_flow():
    print_header("TEST 3: SHOPKEEPER (KIOSK / E-SEVA OPERATOR) COMPLETE E2E WORKFLOW")

    # 1. Login Shopkeeper
    login_res = requests.post(f"{BASE_URL}/auth/login/", json={
        "email": "shop@erentkarar.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200, f"Shopkeeper login failed: {login_res.text}"
    token = login_res.json()["data"]["tokens"]["access"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print("[OK] Shopkeeper Authenticated. Role: SHOP_ADMIN / SHOP_OPERATOR.")

    # 2. Get registered shops
    shops_res = requests.get(f"{BASE_URL}/agreements/shops/", headers=headers)
    assert shops_res.status_code == 200, f"Get shops failed: {shops_res.text}"
    shops = shops_res.json().get("results", shops_res.json())
    shop_id = shops[0]["id"] if isinstance(shops, list) and len(shops) > 0 else None
    print(f"[OK] Linked Authorized Kiosk Shop Found: ID {shop_id}")

    # 3. Form submission -> Assisted Kiosk Mode (Mode C)
    payload = {
        "shop_id": shop_id,
        "property_title": "Vadodara 2BHK Assisted Agreement",
        "property_address": "Shop 12, E-Seva Kendra, Alkapuri, Vadodara",
        "property_city": "Vadodara",
        "property_state": "Gujarat",
        "property_pincode": "390007",
        "property_category": "2BHK Residential Flat",
        "monthly_rent": 16000,
        "security_deposit": 32000,
        "maintenance_amount": 1500,
        "duration_months": 11,
        "start_date": "2026-11-01",
        "notice_period_days": 30,
        "lock_in_months": 6,
        "agreement_type": "RESIDENTIAL",
        "owner_details": {
            "full_name": "Bhavikbhai K. Joshi",
            "email": "bhavik.joshi@gmail.com",
            "phone": "9825411111",
            "address": "Alkapuri, Vadodara",
        },
        "tenant_details": {
            "full_name": "Pooja V. Rathod",
            "email": "pooja.rathod@gmail.com",
            "phone": "9825422222",
            "address": "Sayajigunj, Vadodara",
        }
    }
    create_res = requests.post(f"{BASE_URL}/agreements/create-assisted/", json=payload, headers=headers)
    assert create_res.status_code == 201, f"Assisted agreement creation failed: {create_res.text}"
    agr = create_res.json()["data"]
    agr_id = agr["id"]
    print(f"[OK] Assisted Kiosk Agreement created in Database: #{agr['agreement_number']} (UUID: {agr_id})")
    print(f"     Creator: {agr['creator_type']} | Shop: {agr.get('shop')} | Kiosk Session: {agr.get('kiosk_session')}")

    # 4. Aadhaar Verification
    v_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/verify-identity/", json={
        "party_type": "OWNER",
        "aadhaar_number": "999988887777",
        "otp_code": "123456"
    })
    assert v_res.status_code == 200, f"v_res failed: {v_res.status_code} {v_res.text}"
    v_res2 = requests.post(f"{BASE_URL}/agreements/{agr_id}/verify-identity/", json={
        "party_type": "TENANT",
        "aadhaar_number": "123456789012",
        "otp_code": "123456"
    })
    assert v_res2.status_code == 200
    print("[OK] Both Assisted Parties Aadhaar verified via Kiosk terminal.")

    # 5. Digital eSign
    s_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/sign/", json={"sign_both": True})
    assert s_res.status_code == 200
    print(f"[OK] Both Assisted Parties Digitally Signed: {s_res.json()['message']}")

    # 6. e-Stamping
    stamp_res = requests.post(f"{BASE_URL}/agreements/{agr_id}/stamp/")
    assert stamp_res.status_code == 200
    stamped_data = stamp_res.json()["data"]
    print(f"[OK] Government e-Stamping Processed for Kiosk:")
    print(f"     Certificate Number: {stamped_data.get('stamp_certificate_number')}")
    print(f"     Status: {stamped_data.get('status')}")

    # 7. PDF Download
    pdf_res = requests.get(f"{BASE_URL}/agreements/{agr_id}/download-pdf/")
    assert pdf_res.status_code == 200 and len(pdf_res.content) > 1000
    print(f"[OK] Final Kiosk Executed Deed PDF Downloaded: {len(pdf_res.content)} bytes.")


if __name__ == "__main__":
    try:
        test_owner_flow()
        test_tenant_flow()
        test_shopkeeper_flow()
        print("\n" + "="*75)
        print("ALL 3 ROLES (OWNER, TENANT, SHOPKEEPER) VERIFIED & CONNECTED PERFECTLY!")
        print("="*75 + "\n")
    except Exception as e:
        print(f"\n[ERROR] TEST RUN FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
