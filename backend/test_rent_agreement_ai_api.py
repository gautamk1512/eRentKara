import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_ai_agreement_execution():
    print("Testing Rent Agreement AI Studio API Pipeline...")

    payload = {
        "property_title": "2 BHK Apartment at Ahmedabad",
        "property_address": "Flat 402, Gokul Heights, Bodakdev, Ahmedabad",
        "property_city": "Ahmedabad",
        "property_state": "Gujarat",
        "property_pincode": "380054",
        "property_category": "RESIDENTIAL_APARTMENT",
        "monthly_rent": 22000,
        "security_deposit": 44000,
        "maintenance_amount": 2500,
        "duration_months": 11,
        "start_date": "2026-10-01",
        "notice_period_days": 30,
        "lock_in_months": 3,
        "agreement_type": "RESIDENTIAL",
        "owner_details": {
            "full_name": "Rajeshbhai Patel",
            "email": "rajesh.patel.ai.test@erentkarar.com",
            "phone": "9825012345",
            "address": "B-12 Shivalik Park, Satellite, Ahmedabad - 380015",
        },
        "tenant_details": {
            "full_name": "Sunil Verma",
            "email": "sunil.verma.ai.test@erentkarar.com",
            "phone": "9876543210",
            "address": "Flat 402, Gokul Heights, Bodakdev, Ahmedabad - 380054",
        }
    }

    # Step 1: Create Agreement via Owner endpoint
    print("1. Creating Agreement via /agreements/create-owner/...")
    res = requests.post(f"{BASE_URL}/agreements/create-owner/", json=payload)
    if res.status_code != 201:
        print(f"[FAIL] Create Owner returned status {res.status_code}: {res.text}")
        return False
    
    data = res.json()
    agr = data["data"]
    agr_id = agr["id"]
    token = data.get("tokens", {}).get("access")
    print(f"[OK] Agreement Created: ID={agr_id}, Status={agr.get('status')}")
    
    headers = {"Authorization": f"Bearer {token}"} if token else {}

    # Step 2: Aadhaar OTP Verification
    print("2. Verifying Aadhaar identity via /agreements/{id}/verify-identity/...")
    verif_res = requests.post(
        f"{BASE_URL}/agreements/{agr_id}/verify-identity/",
        json={
            "party_type": "OWNER",
            "aadhaar_number": "987654321012",
            "otp_code": "123456"
        },
        headers=headers
    )
    if verif_res.status_code != 200:
        print(f"[FAIL] Identity verification failed: {verif_res.text}")
        return False
    print(f"[OK] Aadhaar Identity Verified: {verif_res.json().get('message')}")

    # Step 3: Digital eSign
    print("3. Executing Digital eSign via /agreements/{id}/sign/...")
    sign_res = requests.post(
        f"{BASE_URL}/agreements/{agr_id}/sign/",
        json={"party_type": "OWNER"},
        headers=headers
    )
    if sign_res.status_code != 200:
        print(f"[FAIL] Sign failed: {sign_res.text}")
        return False
    print(f"[OK] Agreement Digital eSign Succeeded: {sign_res.json().get('message')}")

    # Step 4: e-Stamping
    print("4. Stamping via /agreements/{id}/stamp/...")
    stamp_res = requests.post(
        f"{BASE_URL}/agreements/{agr_id}/stamp/",
        json={},
        headers=headers
    )
    if stamp_res.status_code != 200:
        print(f"[FAIL] Stamp failed: {stamp_res.text}")
        return False
    stamp_data = stamp_res.json()
    cert_no = stamp_data.get("data", {}).get("stamp_certificate_number")
    print(f"[OK] Government e-Stamp Affixed! Certificate: {cert_no}")

    # Step 5: PDF Download
    print("5. Downloading Executed Deed PDF via /agreements/{id}/download-pdf/...")
    pdf_res = requests.get(f"{BASE_URL}/agreements/{agr_id}/download-pdf/", headers=headers)
    if pdf_res.status_code != 200:
        print(f"[FAIL] PDF download failed: {pdf_res.status_code}")
        return False
    
    if pdf_res.content.startswith(b"%PDF"):
        print(f"[OK] Valid Executed PDF received! Size: {len(pdf_res.content)} bytes.")
    else:
        print(f"[WARN] Received content is not %PDF (first 20 bytes: {pdf_res.content[:20]})")

    print("\nALL RENT AGREEMENT AI BACKEND PIPELINE STEPS PASSED SUCCESSFULLY!")
    return True

if __name__ == "__main__":
    success = test_ai_agreement_execution()
    sys.exit(0 if success else 1)
