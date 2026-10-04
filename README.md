# eRentKarar.com — India's Rental Operating System + Marketplace

[![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-emerald)](docs/ARCHITECTURE.md)
[![Compliance](https://img.shields.io/badge/Compliance-Model%20Tenancy%20Act%202021-blue)](docs/AGREEMENTS.md)
[![Security](https://img.shields.io/badge/Security-Strict%20RBAC%20%2B%20No%20IDOR-purple)](docs/SECURITY.md)
[![Ekrar AI](https://img.shields.io/badge/AI-Ekrar%20Rental%20Assistant-teal)](docs/AI.md)

**Domain:** [https://erentkarar.com](https://erentkarar.com)  
**Positioning:** "India's Smart Rental Management & Property Marketplace — Manage Properties. Find Tenants. Collect Rent. Sign Agreements. Everything in One Place."

---

## 🌟 Executive Overview
**eRentKarar** is an India-first, production-grade SaaS platform combining:
1. **Rental Property Management**: Full inventory hierarchy (`Property -> Building -> Floor -> Room -> Bed`) with real-time status management.
2. **Public Rental Marketplace**: SEO-ready discovery for PGs, Hostels, Co-Living, and Flats across major Indian cities (Bengaluru, Pune, Delhi NCR, Hyderabad, Mumbai, Chennai) with zero fake brokerage.
3. **Double-Booking Protected Reservation Engine**: Pessimistic database locking (`select_for_update`) ensuring zero concurrent overbooking of beds.
4. **India Legal Agreement & eSign Engine**: State-specific stamp duty calculations (KA, MH, DL, TN, TS, UP) with digital signing and PDF generation.
5. **Automated Rent & Utility Invoicing**: Base rent, maintenance charges, and sub-meter electricity readings with 1-click UPI checkout and payment receipts.
6. **Tenant Aadhaar/PAN KYC Pipeline**: Document uploads with masked identifiers and private document storage.
7. **Maintenance & Complaint Kanban**: Multi-category ticketing (Plumbing, Electrical, Appliance, Cleaning) with urgency levels.
8. **Mess & Food Waste Opt-Out**: Weekly meal schedules with tenant skip options.
9. **Ekrar AI Business Assistant**: Natural language querying in Hindi and English with safe read-only tools and confirmation-guarded actions.
10. **Growth & Referral Engine**: Anti-fraud referral tracking and reward ledgers.

---

## 🏗️ Technology Stack
- **Backend**: Python 3.13 / Django 5.x / Django REST Framework / SimpleJWT / ReportLab
- **Frontend**: Next.js 14 (App Router) / TypeScript / Tailwind CSS / Lucide React
- **Database**: PostgreSQL 16 (with SQLite local fallback)
- **Cache & Queue**: Redis 7 / Celery
- **Deployment**: Docker & Docker Compose / Nginx Reverse Proxy / Health & Readiness probes

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed database with realistic Indian rental data
python seed_data.py

# Start Django development server (Port 8000)
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server (Port 3000)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the application!

---

## 🔑 Demo Account Credentials
- **Property Owner / Landlord:** `owner@erentkarar.com` / `Password123!`
- **Active Resident Tenant:** `tenant@erentkarar.com` / `Password123!`
- **Super Administrator:** `admin@erentkarar.com` / `Admin@12345`

---

## 📚 Technical Documentation
- [Master Architectural Blueprint](docs/ARCHITECTURE.md)
- [REST API v1 Specification](docs/API.md)
- [Database Schema & ERD](docs/DATABASE.md)
- [Security & Compliance Plan](docs/SECURITY.md)
- [Ekrar AI Assistant Architecture](docs/AI.md)
- [State Agreement & eSign Engine](docs/AGREEMENTS.md)
- [Production & Docker Deployment](docs/DEPLOYMENT.md)
