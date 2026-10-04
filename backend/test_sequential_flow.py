import requests
import sys

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000/api/v1"

def print_step(title):
    print(f"\n{'='*70}\n[TEST STEP] {title}\n{'='*70}")

def run_tests():
    # -------------------------------------------------------------
    # 1. Health Check
    # -------------------------------------------------------------
    print_step("1. Verifying System Health & Database Connectivity")
    h_resp = requests.get("http://127.0.0.1:8000/health/")
    assert h_resp.status_code == 200, f"Health check failed: {h_resp.text}"
    print("Health response:", h_resp.json())

    # -------------------------------------------------------------
    # 2. Login with standard credentials (Owner & Tenant)
    # -------------------------------------------------------------
    print_step("2. Testing Login with Standard Credentials")
    login_resp = requests.post(f"{BASE_URL}/auth/login/", json={
        "email": "owner@erentkarar.com",
        "password": "Password123!"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    owner_token = login_resp.json()["data"]["tokens"]["access"]
    print("Owner Login Successful! Token received:", owner_token[:30] + "...")

    tenant_resp = requests.post(f"{BASE_URL}/auth/login/", json={
        "email": "tenant@erentkarar.com",
        "password": "Password123!"
    })
    assert tenant_resp.status_code == 200, f"Tenant login failed: {tenant_resp.text}"
    tenant_token = tenant_resp.json()["data"]["tokens"]["access"]
    print("Tenant Login Successful! Token received:", tenant_token[:30] + "...")

    # -------------------------------------------------------------
    # 3. Google OAuth Direct Sign-In (3 Formats: Owner, Tenant, Shop)
    # -------------------------------------------------------------
    print_step("3. Testing Google Auth in 3 Formats (Owner, Tenant, Shop)")
    for role, email_prefix, name in [
        ("OWNER", "google.owner", "Google Rajesh Patel"),
        ("TENANT", "google.tenant", "Google Amit Shah"),
        ("SHOP_OPERATOR", "google.kiosk", "Google Kiosk Operator")
    ]:
        g_resp = requests.post(f"{BASE_URL}/auth/google/", json={
            "email": f"{email_prefix}@erentkarar.com",
            "name": name,
            "role": role,
            "force_role": True,
        })
        assert g_resp.status_code == 200, f"Google login failed for {role}: {g_resp.text}"
        g_data = g_resp.json()["data"]
        print(f"[OK] Google Auth for {role} succeeded:")
        print(f"  User: {g_data['user']['email']}, Role: {g_data['user']['role']}, Verified: {g_data['user']['is_verified']}")
        print(f"  Access Token: {g_data['tokens']['access'][:30]}...")

    # -------------------------------------------------------------
    # 4. Create Rental Agreement Form -> Store in actual database
    # -------------------------------------------------------------
    print_step("4. Submitting Rental Agreement Form -> Persisting to Database")
    headers = {"Authorization": f"Bearer {owner_token}", "Content-Type": "application/json"}
    form_payload = {
        "property_title": "3BHK Luxury Apartment, SG Highway",
        "property_address": "Flat 801, Titanium City Centre, Prahlad Nagar, Ahmedabad",
        "property_city": "Ahmedabad",
        "property_state": "Gujarat",
        "property_pincode": "380015",
        "property_category": "3BHK Flat",
        "monthly_rent": 22000,
        "security_deposit": 44000,
        "maintenance_amount": 2500,
        "duration_months": 11,
        "start_date": "2026-10-15",
        "notice_period_days": 30,
        "lock_in_months": 6,
        "agreement_type": "RESIDENTIAL",
        "language": "BILINGUAL",
        "owner_details": {
            "full_name": "Rajeshbhai K. Patel",
            "email": "owner@erentkarar.com",
            "phone": "9825012345",
            "address": "Flat 801, Titanium City Centre, Ahmedabad",
        },
        "tenant_details": {
            "full_name": "Amitbhai S. Shah",
            "email": "tenant@erentkarar.com",
            "phone": "9825067890",
            "address": "B-201, Shivalik Park, Surat, Gujarat",
        }
    }

    create_resp = requests.post(f"{BASE_URL}/agreements/create-owner/", json=form_payload, headers=headers)
    assert create_resp.status_code == 201, f"Agreement creation failed: {create_resp.text}"
    agr_data = create_resp.json()["data"]
    agr_id = agr_data["id"]
    agr_num = agr_data["agreement_number"]
    print("[OK] Agreement Draft Created & Stored in Database:")
    print(f"  Agreement Number: {agr_num}")
    print(f"  Database UUID: {agr_id}")
    print(f"  Status: {agr_data['status']}")
    print(f"  Stamp Duty: Rs. {agr_data['stamp_duty_amount']}")
    print(f"  Parties Count: {len(agr_data['parties'])}")

    # -------------------------------------------------------------
    # 5. Sequential Step A: Aadhaar Card OTP Dispatch & Verification
    # -------------------------------------------------------------
    print_step("5. Sequential Pipeline Step A: Aadhaar OTP Dispatch & Verification")
    # Send OTP
    otp_dispatch = requests.post(f"{BASE_URL}/agreements/{agr_id}/send-aadhaar-otp/", json={
        "party_type": "OWNER",
        "aadhaar_number": "999988887777"
    })
    assert otp_dispatch.status_code == 200, f"Aadhaar OTP dispatch failed: {otp_dispatch.text}"
    print("[OK] Aadhaar OTP Dispatched via UIDAI gateway:", otp_dispatch.json().get("message"))

    # Verify OTP
    otp_verify = requests.post(f"{BASE_URL}/agreements/{agr_id}/verify-identity/", json={
        "party_type": "OWNER",
        "aadhaar_number": "999988887777",
        "otp_code": "123456"
    })
    assert otp_verify.status_code == 200, f"Aadhaar identity verification failed: {otp_verify.text}"
    print("[OK] Owner Aadhaar Verified:", otp_verify.json().get("message"))

    # Also verify Tenant Aadhaar
    tenant_otp = requests.post(f"{BASE_URL}/agreements/{agr_id}/verify-identity/", json={
        "party_type": "TENANT",
        "aadhaar_number": "123456789012",
        "otp_code": "123456"
    })
    assert tenant_otp.status_code == 200, f"Tenant Aadhaar verification failed: {tenant_otp.text}"
    print("[OK] Tenant Aadhaar Verified:", tenant_otp.json().get("message"))

    # -------------------------------------------------------------
    # 6. Sequential Step B: Digital Signing (Both Parties)
    # -------------------------------------------------------------
    print_step("6. Sequential Pipeline Step B: Digital eSign Execution")
    sign_resp = requests.post(f"{BASE_URL}/agreements/{agr_id}/sign/", json={
        "sign_both": True
    })
    assert sign_resp.status_code == 200, f"Signing failed: {sign_resp.text}"
    print("[OK] Both parties digitally signed:", sign_resp.json().get("message"))

    # -------------------------------------------------------------
    # 7. Sequential Step C: Government e-Stamping & PDF Generation
    # -------------------------------------------------------------
    print_step("7. Sequential Pipeline Step C: Government e-Stamping & PDF Compilation")
    stamp_resp = requests.post(f"{BASE_URL}/agreements/{agr_id}/stamp/")
    assert stamp_resp.status_code == 200, f"e-Stamping failed: {stamp_resp.text}"
    stamped_data = stamp_resp.json()["data"]
    print("[OK] e-Stamping Processed Successfully:")
    print(f"  Status: {stamped_data['status']}")
    print(f"  e-Stamp Certificate: {stamped_data.get('stamp_certificate_number')}")
    print(f"  Final PDF Generated: {bool(stamped_data.get('final_pdf'))}")
    print(f"  Document SHA-256 Hash: {stamped_data.get('document_hash')}")

    # -------------------------------------------------------------
    # 8. Download & Verify PDF
    # -------------------------------------------------------------
    print_step("8. Downloading Compiled Deed PDF Document")
    pdf_resp = requests.get(f"{BASE_URL}/agreements/{agr_id}/download-pdf/")
    assert pdf_resp.status_code == 200, f"PDF download failed: {pdf_resp.status_code}"
    assert pdf_resp.headers.get("content-type") == "application/pdf"
    assert len(pdf_resp.content) > 1000, "PDF size is too small"
    print(f"[OK] PDF downloaded successfully: {len(pdf_resp.content)} bytes, Content-Type: {pdf_resp.headers.get('content-type')}")

    # -------------------------------------------------------------
    # 9. Verify in Database via Direct API & Public Verification
    # -------------------------------------------------------------
    print_step("9. Verifying Database State and Public Token Verification")
    token = stamped_data.get("public_verification_token")
    if token:
        pub_resp = requests.get(f"{BASE_URL}/agreements/verify/{token}/")
        assert pub_resp.status_code == 200, f"Public verification failed: {pub_resp.text}"
        pub_data = pub_resp.json()["data"]
        print("[OK] Public Verification Endpoint Response:")
        print(f"  Agreement Number: {pub_data['agreement_number']}")
        print(f"  e-Stamp Certificate: {pub_data.get('stamp_certificate_number')}")
        print(f"  Execution Status: {pub_data.get('status')}")
        print(f"  Verification Valid: {pub_data.get('is_valid')}")

    print(f"\n{'='*70}\nALL SEQUENTIAL DATABASE & FLOW CHECKS PASSED PERFECTLY!\n{'='*70}\n")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"\n[ERROR] TEST ERROR: {e}")
        sys.exit(1)
