# 🏢 eRentKarar — India's Smart Rental Management & Property Marketplace

[![Production Status](https://img.shields.io/badge/Production-Live%20%26%20Secured-brightgreen)](https://erentkarar.com)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-emerald)](docs/ARCHITECTURE.md)
[![Database & ERD](https://img.shields.io/badge/Database-Mermaid%20ERD%20%2B%20Schemas-blue)](docs/DATABASE_AND_ERD.md)
[![Compliance](https://img.shields.io/badge/Compliance-Model%20Tenancy%20Act%202021-purple)](docs/MODEL_ARCHITECTURE.md)
[![Security](https://img.shields.io/badge/Security-Strict%20RBAC%20%2B%20UIDAI%20eSign-teal)](docs/SECURITY.md)

**Domain:** [https://erentkarar.com](https://erentkarar.com)  
**Positioning:** *"Manage Properties. Find Tenants. Collect Rent. Sign Legal Agreements. Everything in One Unified Cloud Platform."*

---

## 🌟 Executive Overview

**eRentKarar** is a production-grade, India-first PropTech SaaS platform designed to solve the three core challenges of India's rental ecosystem:
1. **0% Brokerage Public Marketplace**: Transparent stay discovery for PGs, Hostels, Co-Living Spaces, and Residential Flats across Gujarat (Vadodara, Ahmedabad, Surat, Gandhinagar, Rajkot) and PAN-India metros (Bengaluru, Pune, Mumbai, Delhi NCR, Hyderabad).
2. **Rental & PG Cloud Operating System**: Enterprise-grade multi-property inventory management (`Property ➔ Building ➔ Floor ➔ Room ➔ Bed`), sub-meter electricity computation, WhatsApp UPI payment links, tenant KYC admission, and maintenance Kanban.
3. **Legal e-Stamp & Agreement Studio**: Compliant digital tenancy agreements with state-specific non-judicial e-stamps, Model Tenancy Act adherence, dual Aadhaar OTP eSign, and QR verification.

---

## 📚 Complete Technical Documentation

| Documentation Guide | Link | Description |
| :--- | :--- | :--- |
| **Database & Mermaid ERD** | [docs/DATABASE_AND_ERD.md](docs/DATABASE_AND_ERD.md) | Full Entity-Relationship Diagrams, table schemas, indexing, and pessimistic concurrency locking. |
| **Product & Features Matrix** | [docs/PRODUCT_AND_FEATURES.md](docs/PRODUCT_AND_FEATURES.md) | Exhaustive feature breakdown (Implemented vs. Future Roadmap) and user journey workflows. |
| **Model Architecture** | [docs/MODEL_ARCHITECTURE.md](docs/MODEL_ARCHITECTURE.md) | Django ORM models across all 22 apps, field invariants, and state transition machines. |
| **User & Admin Manual** | [docs/USER_AND_ADMIN_MANUAL.md](docs/USER_AND_ADMIN_MANUAL.md) | Complete operational guide for Landlords, Tenants, Kiosk Operators, and Super Administrators. |
| **Cloud Infrastructure & Deploy** | [docs/DEPLOYMENT_AND_INFRASTRUCTURE.md](docs/DEPLOYMENT_AND_INFRASTRUCTURE.md) | AWS EC2 configuration, Nginx reverse proxy, PM2 process management, and GoDaddy DNS setup. |
| **REST API v1 Specification** | [docs/API.md](docs/API.md) | Complete OpenAPI endpoints, request/response formats, and JWT authentication rules. |
| **Security & Privacy Plan** | [docs/SECURITY.md](docs/SECURITY.md) | Multi-tenant data isolation, Aadhaar masking, AES-256 encryption, and audit logging. |

---

## 📐 System Architecture

```
                                  [ Internet Traffic ]
                                           │
                                    (DNS Resolution)
                                           │
                                           ▼
                              [ GoDaddy DNS A Record ]
                             (erentkarar.com ➔ 16.170.201.75)
                                           │
                                           ▼
                         [ AWS Security Group Firewall ]
                               (Ports 80, 443, 22)
                                           │
                                           ▼
                            [ Nginx Reverse Proxy (443) ]
                         (SSL Termination / Gzip / Caching)
                                           │
            ┌──────────────────────────────┴──────────────────────────────┐
            │ (Path: /api/*, /admin/*, /static/*, /media/*)              │ (Path: /* Default)
            ▼                                                             ▼
  [ Django Gunicorn Server ]                                   [ Next.js 14 App Server ]
   (127.0.0.1:8000 via PM2)                                     (127.0.0.1:3000 via PM2)
            │                                                             │
            ▼                                                             ▼
  [ SQLite / Media Storage ]                                   [ React SSR / Static Chunks ]
```

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Leaflet Maps, Lucide Icons.
- **Backend**: Python 3.12, Django 5.1, Django REST Framework, Django Unfold Admin, ReportLab PDF Engine.
- **Database & Concurrency**: PostgreSQL / SQLite with `select_for_update` pessimistic locking.
- **Process Management**: PM2 Supervisor.
- **Reverse Proxy & Security**: Nginx with Gzip compression and Certbot Let's Encrypt SSL/HTTPS.
- **Hosting & Infrastructure**: AWS EC2 (`eu-north-1`), GoDaddy DNS.

---

## 🚀 Quick Local Development Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python populate_gujarat_properties.py
python seed_comprehensive_rental_os.py
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Production Credentials & Access Links

- **Live Website**: [https://erentkarar.com](https://erentkarar.com)
- **Properties Marketplace**: [https://erentkarar.com/properties](https://erentkarar.com/properties)
- **Rental OS Platform**: [https://erentkarar.com/rental](https://erentkarar.com/rental)
- **AI Agreement Studio**: [https://erentkarar.com/rent-agreement-ai](https://erentkarar.com/rent-agreement-ai)
- **Master Admin OS**: [https://erentkarar.com/admin/](https://erentkarar.com/admin/)
  - **Username**: `admin` *(or `admin@erentkarar.com`)*
  - **Password**: `Admin@1234`
- **Demo Landlord**: `owner@erentkarar.com` / `Owner@1234`
- **Demo Tenant**: `tenant@erentkarar.com` / `Tenant@1234`

---

## 📄 License & Compliance
Built in compliance with the **Model Tenancy Act (MTA) 2021**, the **Information Technology Act 2000**, and the **Indian Stamp Act 1899**.  
© 2026 eRentKarar. All rights reserved.
