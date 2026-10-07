# Rental agreement registration fix — 7 October 2026

Deployed to https://erentkarar.com.

## Cause and changes

The published agreement wizard and layout JavaScript included `http://localhost:8000/api/v1`. In a customer's browser this targets their own device and causes registration to fail.

Browser API, Razorpay fallback requests and document downloads now use the website origin. A Next.js rewrite proxies `/api/v1` for local development. Server requests use `BACKEND_URL`.

The agreement wizard uses the JWT returned by registration instead of making a second login request. Phone autofill uses the backend's `phone_number` field, shop registrations retain the `SHOP_OPERATOR` role, and field validation errors are readable. Registration now wraps user, profile, organization and audit creation in one database transaction.

## Verification

- TypeScript check and frontend connectivity regression checks passed.
- All 16 registration, agreement fulfilment and payment/order integration tests passed. Gateway interactions in integration tests were mocked; no real payment was charged.
- Production build completed, including lint/type checks and all 71 pages.
- Live temporary account registration returned HTTP 201; JWT authentication and password login returned HTTP 200; duplicate registration returned HTTP 400.
- Production database confirmed the user, profile, organization and registration audit record. The temporary QA user and organization were removed.
- The new live wizard/layout bundles no longer include the incorrect localhost API address.
- Both production PM2 services are online. No migrations were pending.
- User, AgreementPayment, AgreementOrder, Invoice and Payment models are registered in Django admin.
- Production Razorpay credentials passed a read-only authenticated request (HTTP 200). No credential values were printed by the configuration check.

## Remaining configuration

SMTP credentials, Google OAuth client ID and Razorpay webhook secret are absent from production configuration. Email currently uses Django's console backend. These integrations require the actual provider configuration before they can be verified or enabled.

Production source, database and previous frontend build are backed up at `/home/ubuntu/deploy-backups/registration-20261007T102050Z`. Only disposable Next.js/npm caches were cleared to resolve a full disk; 386 MB was free after deployment. Existing customer records were preserved.
