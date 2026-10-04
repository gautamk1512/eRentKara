# eRentKarar — REST API Reference (v1)

**Base URL:** `http://localhost:8000/api/v1/` (Development) / `https://erentkarar.com/api/v1/` (Production)  
**Standard Response Contract:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation executed successfully"
}
```

---

## 1. Authentication & Identity (`/auth/`)
- `POST /auth/register/`: Register a new Landlord or Tenant with JWT token issuance.
- `POST /auth/login/`: Authenticate using email and password. Returns access and refresh JWT pair.
- `POST /auth/refresh/`: Refresh an expired access token.
- `GET /auth/me/`: Retrieve authenticated user profile, active memberships, and notification preferences.

## 2. Public Marketplace (`/marketplace/`)
- `GET /marketplace/search/?city=Bengaluru&type=PG&max_rent=15000`: Search and filter published rental listings.
- `GET /marketplace/property/<slug>/`: Detailed property listing with inventory hierarchy, amenities, and policies.
- `POST /marketplace/enquire/`: Submit tenant inquiry. Converts instantly into an inbound CRM Lead.
- `GET /marketplace/cities/`: Get list of supported Indian rental metropolitan areas.

## 3. Inventory & Property Hierarchy (`/properties/`)
- `GET /properties/`: List properties belonging to user's organization.
- `POST /properties/<id>/toggle_publish/`: Toggle listing visibility on the public marketplace.
- `POST /properties/beds/<id>/update_status/`: Update bed status (`AVAILABLE`, `RESERVED`, `OCCUPIED`, `MAINTENANCE`, `BLOCKED`).

## 4. Bookings Engine (`/bookings/`)
- `POST /bookings/`: Atomic reservation with pessimistic database locking (`select_for_update`) to prevent double-booking.

## 5. Tenancies (`/tenants/`)
- `GET /tenants/`: List active tenancies for organization or current tenant.
- `GET /tenants/my_stay/`: Current active stay for the tenant self-service portal.
- `POST /tenants/<id>/onboard/`: Move tenant in and transition room/bed status to `OCCUPIED`.

## 6. Indian Rental Agreements & eSign (`/agreements/`)
- `GET /agreements/state-rules/?state=KA`: Calculate state stamp duty, registration fee, and statutory act references.
- `POST /agreements/draft/`: Generate legal agreement draft with state stamp duty.
- `POST /agreements/<id>/send_for_esign/`: Dispatch signing invitations via eSign provider adapter.
- `POST /agreements/<id>/sign/`: Record digital signature and generate signed PDF deed.

## 7. Invoices & Billing (`/invoices/`)
- `GET /invoices/`: List itemized monthly invoices.
- `POST /invoices/generate_monthly_invoices/`: Bulk monthly rent roll invoice generation for all active tenants.
- `POST /invoices/<id>/generate_receipt/`: Generate downloadable PDF tax receipt.

## 8. Payments (`/payments/`)
- `POST /payments/create_checkout_order/`: Create UPI/Razorpay payment order intent.
- `POST /payments/<id>/confirm_payment/`: Reconcile payment and mark invoice as `PAID`.
- `POST /payments/webhook/`: Idempotent server-side webhook processor.

## 9. Maintenance & Complaints (`/complaints/`)
- `GET /complaints/`: List open tickets with category and urgency levels.
- `POST /complaints/`: Submit new maintenance complaint with photo attachment.
- `POST /complaints/<id>/update_status/`: Update ticket status (`OPEN`, `ASSIGNED`, `RESOLVED`, `CLOSED`).

## 10. Ekrar AI Assistant (`/ai/`)
- `POST /ai/chat/`: Natural language business query in Hindi/English using safe read-only tools.
- `POST /ai/action/<id>/confirm/`: Confirm and execute user-approved sensitive actions (e.g. WhatsApp rent reminders).
