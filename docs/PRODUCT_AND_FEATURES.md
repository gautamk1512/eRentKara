# 📦 eRentKarar — Product Architecture, Features & Roadmap

This document outlines the complete **Product Architecture**, detailed feature capabilities across all subsystems, and the explicit **Scope Matrix** (What features exist today vs. what is planned for future milestones).

---

## 🧭 Product Vision & Value Proposition

**eRentKarar** is an India-first unified PropTech Operating System combining:
1. **Direct Property Marketplace (0% Brokerage)**: Transparent stay discovery for Tenants.
2. **Rental & PG Cloud OS**: Enterprise-grade multi-property inventory, tenant KYC, and automated rent collection for Landlords.
3. **Legal e-Stamp & Agreement Studio**: 100% compliant digital tenancy agreements with state-specific non-judicial e-stamps and Aadhaar OTP eSign.

---

## 🗺️ Product Architectural Blueprint

```
                                    ┌──────────────────────────────────┐
                                    │       eRentKarar Platform        │
                                    │    (Web, Mobile PWA, Kiosk)      │
                                    └─────────────────┬────────────────┘
                                                      │
         ┌────────────────────────┬───────────────────┴─────────────────┬────────────────────────┐
         ▼                        ▼                                     ▼                        ▼
┌──────────────────┐    ┌──────────────────┐                  ┌──────────────────┐    ┌──────────────────┐
│   Public Stay    │    │  Rental & PG OS  │                  │  AI Legal Deed   │    │   Admin Master   │
│   Marketplace    │    │  (Landlord/Ops)  │                  │  & e-Stamp Hub   │    │    Control OS    │
└────────┬─────────┘    └────────┬─────────┘                  └────────┬─────────┘    └────────┬─────────┘
         │                       │                                     │                       │
         ├─ Geo Map Pins         ├─ 5-Tier Inventory                   ├─ Model Tenancy Act    ├─ Unfold Admin
         ├─ ₹1,000 Bed Lock      ├─ Sub-Meter Billing                  ├─ State Duty Calc      ├─ KYC Auditing
         ├─ Zero Brokerage       ├─ WhatsApp Links                     ├─ Aadhaar OTP eSign    ├─ Property Review
         └─ Direct Chat/Enquiry  └─ Maintenance Kanban                 └─ QR Verification      └─ Financial Ledger
```

---

## ✅ Implemented Features (What Exists Today)

### 1. 🌐 Public Marketplace & Stays Discovery
- **PAN-India & Gujarat City Coverage**: Full coverage of Vadodara, Ahmedabad, Surat, Gandhinagar, Rajkot, Bengaluru, Pune, Delhi NCR, Mumbai.
- **Interactive OpenStreetMap Explorer**: Dual view (Split View, Grid View, Map Only) with zero-jank interactive price pins.
- **Persona & Filter Engine**: Filter by property type (PG, Co-Living, Flats, Rooms, Commercial), gender (Boys, Girls, Co-ed, Family), AC/Non-AC, and food inclusion.
- **Instant Reservation & Bed Lock**: Atomic reservation system locking beds for 15 minutes with a ₹1,000 refundable token to prevent concurrent double-bookings.

### 2. 🏢 Rental & PG Management Cloud OS (For Owners & Landlords)
- **5-Tier Inventory Hierarchy**: `Property ➔ Building ➔ Floor ➔ Room ➔ Bed` tracking with live occupancy counters.
- **Sub-Meter Electricity Billing Engine**: Formula-based electricity bill computation: `(Current Units - Previous Units) * Rate per Unit` itemized automatically into monthly invoices.
- **Automated Rent Invoicing & UPI Reminders**: WhatsApp payment link generation with PhonePe, Google Pay, and Paytm zero-fee settlement.
- **Tenant KYC & Admission Management**: Aadhaar and PAN verification, photo upload, emergency contact capture, and digital admission form generation.
- **Maintenance & Complaints Kanban**: Real-time ticketing with 4 categories (Plumbing, Electrical, Appliance, Cleaning) and priority flags.
- **Mess & Food Waste Reduction**: Weekly meal schedule publishing with tenant skip/opt-out toggles to reduce commercial kitchen wastage.
- **Visitor & Security Log**: Guest check-in/check-out timestamp logging with digital gate passes.

### 3. 📜 AI Rental Agreement & Legal e-Stamping Studio
- **3-Minute AI Draft Studio**: Conversational AI assistant asking landlord/tenant parameters and drafting a legally binding 11-month lease deed.
- **State-Wise Stamp Duty Engine**: Automated duty calculation for 7 major states (Gujarat ₹300-₹500, Maharashtra 0.25%, Karnataka ₹500, Delhi ₹500, Tamil Nadu 1%, Telangana, Uttar Pradesh).
- **Aadhaar OTP Dual eSign**: IT Act 2000 compliant digital signatures for both Landlord and Tenant with verifiable audit trails.
- **Verifiable QR Stamp Papers**: Government-styled digital stamp certificate overlay with SHA-256 tamper-proof QR verification link (`/verify/agreement/{id}`).

### 4. 🎥 4K Motion Walkthrough Player
- **3 Switchable Chapters**: Step-by-step video animation for Landlords, Tenants, and Legal Agreement drafters.
- **Interactive Controls**: Play/Pause, 1.0x/1.5x/2.0x playback speed, audio visualizer, scrub dots, and instant Interactive Sandbox mode.

### 5. 📅 Free Demo & Sandbox System
- **1-Click Demo Modal**: Schedule a 1-on-1 personalized onboarding demo with preferred time slot and bed capacity.
- **Live Simulator**: Preloaded dummy landlord dashboard for instant hands-on trial without registration.

### 6. 🧮 10+ Free PropTech Utility Calculators
1. Rent Agreement Generator
2. Rent Receipt Generator (HRA tax exemption compliant)
3. Electricity Sub-Meter Bill Calculator
4. Move-Out Settlement & Security Deposit Deductions Calculator
5. PG/Hostel Revenue & Break-Even Calculator
6. Tenant KYC & Admission Form Generator
7. Police Tenant Verification Form Generator

### 7. 🛡️ Admin Master Control OS (Django Unfold)
- Master approval queue for public property listings.
- KYC review and identity verification queue.
- Dispute resolution, invoice adjustment, and audit log inspection.

### 8. 🌐 Multi-Language Support
- Full interface translation across **English**, **Gujarati (ગુજરાતી)**, and **Hindi (हिन्दी)**.

---

## ❌ Current Boundaries (What Does NOT Exist Today) & Future Roadmap

| Feature Area | Current Status (v1.0 Live) | Future Milestone (v2.0 Roadmap) |
| :--- | :--- | :--- |
| **IoT Smart Electricity Meters** | ⚠️ Manual reading input with automated mathematical billing calculation | 🔄 Direct hardware WiFi/Zigbee pulse integration (Tuya/SmartLife API) |
| **Biometric Hardware Scanners** | ⚠️ Online Aadhaar OTP verification & eSign | 🔄 USB Morpho/Mantra biometric fingerprint reader web driver |
| **Native Mobile Store Binaries** | ⚠️ Full Mobile PWA (Installable on iOS & Android home screens) | 🔄 Native React Native / Flutter builds on Apple App Store & Google Play |
| **WhatsApp Conversational Bot** | ⚠️ 1-Click WhatsApp payment link & notification dispatch | 🔄 In-chat WhatsApp AI agent for rent queries and maintenance booking |
| **Credit Bureau Integration** | ⚠️ Aadhaar/PAN self-attested KYC verification | 🔄 Direct CIBIL / Experian rental credit score checking API |
| **Multi-Currency Cross-Border Rent** | ⚠️ Indian Rupees (INR ₹) & UPI/IMPS/NEFT only | 🔄 International card payments for NRI landlords |

---

## 👥 User Journey Workflows

### Journey A: Property Owner (PG / Hostel / Flat Owner)
1. **Sign Up**: Register via mobile phone with OTP.
2. **Add Property**: Define building name, city, address, room types (Single/2-Sharing/3-Sharing), and rent amounts.
3. **Collect Rent**: On the 1st of every month, enter sub-meter units ➔ click "Generate Invoices" ➔ send automated WhatsApp UPI links.
4. **Manage Operations**: View live bed occupancy, resolve tenant maintenance tickets, and track security deposits.

### Journey B: Stay Seeker / Tenant
1. **Search**: Open `https://erentkarar.com/properties` ➔ filter by city (e.g. Vadodara) ➔ explore map pins.
2. **Reserve Stay**: Click "Lock Bed" ➔ pay ₹1,000 token ➔ receive instant booking confirmation.
3. **Move In & Pay**: Complete online Aadhaar KYC ➔ pay balance deposit/rent via UPI ➔ receive GST rent receipt.
4. **Stay OS**: Raise maintenance tickets in 1-click and opt out of upcoming meals to prevent food waste.

### Journey C: Legal Agreement Drafter (Kiosk / Landlord / Tenant)
1. **Draft Deed**: Open `https://erentkarar.com/rent-agreement-ai` ➔ chat with AI assistant or fill 3-step form.
2. **e-Stamp Paper**: Select state (e.g. Gujarat ₹300) ➔ pay statutory stamp duty.
3. **Aadhaar eSign**: Landlord enters Aadhaar OTP ➔ Tenant receives invite SMS and enters Aadhaar OTP.
4. **Download & Verify**: Download legally enforceable PDF with Government state header and QR verification stamp.
