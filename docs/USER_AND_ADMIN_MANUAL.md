# 📖 eRentKarar — User & Administrator Operations Manual

This comprehensive guide serves as the official operational manual for **Property Owners / Landlords**, **Residents / Tenants**, **Kiosk Documentation Partners**, and **Platform Super Administrators**.

---

## 🔑 Default Production Access Credentials

| Portal / Role | Access URL | Default Username / Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Admin Control OS** | [https://erentkarar.com/admin/](https://erentkarar.com/admin/) | `admin` *(or `admin@erentkarar.com`)* | `Admin@1234` |
| **Property Owner Portal** | [https://erentkarar.com/login?portal=rental](https://erentkarar.com/login?portal=rental) | `owner@erentkarar.com` | `Owner@1234` |
| **Resident Tenant Portal** | [https://erentkarar.com/login?portal=rental](https://erentkarar.com/login?portal=rental) | `tenant@erentkarar.com` | `Tenant@1234` |
| **Digital Agreement Portal** | [https://erentkarar.com/rent-agreement-ai](https://erentkarar.com/rent-agreement-ai) | *Public / Mobile OTP* | *Mobile OTP* |

---

## 🏢 1. Property Owner & PG Landlord Manual

### Step 1: Account Registration & Organization Setup
1. Visit [https://erentkarar.com/register?role=owner](https://erentkarar.com/register?role=owner).
2. Enter your Name, Phone Number, and Business/Organization Name (e.g. *Royal Stays PG*).
3. Verify your phone number with the 6-digit OTP received.
4. Navigate to **Dashboard ➔ Settings** to add your UPI ID (e.g. `landlord@icici`) and Bank Account for zero-brokerage direct tenant rent settlements.

### Step 2: Adding Properties, Rooms & Beds
1. Click **"Properties" ➔ "+ Add New Property"**.
2. Select Property Category: `PG / Hostel`, `Co-Living`, `1/2/3 BHK Flat`, or `Commercial`.
3. Enter Address, City (e.g. *Vadodara*), and Locality (e.g. *Alkapuri*). The system will automatically pin the exact latitude/longitude coordinates on the map.
4. Define Inventory Hierarchy:
   - Add Floors (e.g. *Floor 1, Floor 2*).
   - Add Rooms (e.g. *Room 101 - 2-Sharing AC*).
   - Assign Bed identifiers (e.g. *Bed 101-A, Bed 101-B*) with base monthly rent (₹8,500) and deposit (₹15,000).
5. Toggle **"Publish to Marketplace"** to make it discoverable across India.

### Step 3: Sub-Meter Electricity & Monthly Invoicing
1. On the 1st of every month, navigate to **"Billing ➔ Sub-Meters"**.
2. Enter current electricity meter readings for each room. The calculation engine will compute units consumed:
   $$\text{Electricity Bill} = (\text{Current Units} - \text{Previous Units}) \times \text{Rate per Unit (₹9.50)}$$
3. Click **"Generate Monthly Invoices"**.
4. Click **"Dispatch WhatsApp Invoices"** to send formatted payment summaries with direct UPI QR links to all active tenants.

### Step 4: Resolving Maintenance Tickets
1. Go to **"Complaints Kanban"**.
2. View incoming tickets organized by priority (High, Medium, Low) and category (Plumbing, Electrical, WiFi, Appliance).
3. Click a ticket to assign a staff technician, update status to `IN_PROGRESS`, and mark `RESOLVED` with technician notes.

---

## 🏠 2. Resident Tenant Manual

### Step 1: Finding & Reserving a Verified Stay
1. Visit [https://erentkarar.com/properties](https://erentkarar.com/properties).
2. Filter by City (e.g. *Vadodara*, *Ahmedabad*, *Surat*, *Bengaluru*), Gender preference, Food included, or AC.
3. Switch to **Split View** or **Interactive Map** to see exact locality pins and starting rents.
4. Click **"View Rooms & Beds"** to see live vacancy status.
5. Click **"Lock Bed"** and pay the ₹1,000 refundable token to lock your bed and prevent others from booking it.

### Step 2: Digital Aadhaar KYC & Agreement Signing
1. Click the notification link received via SMS/WhatsApp or open **Tenant Dashboard ➔ KYC**.
2. Enter your Aadhaar Number to receive a UIDAI OTP.
3. Confirm identity to automatically affix your verifiable digital signature to your 11-month lease deed.
4. Download your Government e-Stamped Agreement PDF with QR verification.

### Step 3: Paying Rent Online & Downloading Receipts
1. Open **Tenant Dashboard ➔ Invoices**.
2. Click **"Pay via UPI"** to open your preferred payment app (GPay, PhonePe, Paytm, or BHIM).
3. Once paid, the invoice status changes to `PAID` instantly, and a GST-compliant Rent Receipt is generated for your HRA tax exemption claims.

### Step 4: Raising Maintenance & Skipping Meals
- **Raise Issue**: Click **"Report Issue"**, select category, attach photo, and track resolution in real-time.
- **Meal Opt-Out**: Navigate to **"Mess Schedule"** and toggle *Skip Breakfast / Dinner* before the cut-off time to prevent food waste.

---

## 📜 3. Legal Agreement & Kiosk Partner Manual

### Step 1: 3-Minute AI Assisted Agreement Drafting
1. Visit [https://erentkarar.com/rent-agreement-ai](https://erentkarar.com/rent-agreement-ai).
2. Enter the Landlord Details, Tenant Details, Premises Address, Monthly Rent, and Security Deposit.
3. The AI drafting engine automatically applies standard Model Tenancy Act clauses (5% escalation, 30-day notice period, maintenance liability).

### Step 2: State e-Stamp Certificate Generation
1. Select the property state (e.g. *Gujarat*).
2. The platform automatically calculates the required non-judicial stamp duty (₹300 - ₹500).
3. Pay the state stamp fee online to affix the official e-Stamp certificate serial number (`IN-GJ...`).

### Step 3: Dual Aadhaar OTP eSign & Delivery
1. First party (Landlord) signs via Aadhaar OTP.
2. Second party (Tenant) receives an instant SMS invite link with OTP eSign.
3. Once both signatures are recorded, the final deed is sealed with SHA-256 and made downloadable with a verifiable public QR code.

---

## 🛡️ 4. Super Administrator Control Manual

### Accessing the Master Control OS
- Navigate to: **[https://erentkarar.com/admin/](https://erentkarar.com/admin/)**
- Log in with superuser credentials (`admin` / `Admin@1234`).

### Key Administrative Workflows:
1. **Property Approval Queue**: Under `Marketplace ➔ Properties`, review newly listed properties and set `verification_status = VERIFIED` to display the "Verified Landlord" badge on search results.
2. **KYC Document Auditing**: Under `KYC ➔ Documents`, inspect masked Aadhaar/PAN identity submissions.
3. **Agreement Verification Registry**: Search any agreement by ID (`AGR-GJ-...`) or scan the physical QR code to verify validity against the immutable database registry.
4. **Platform Analytics & Financial Health**: View total properties, active beds, occupancy rates, and stamp duty remitted.
