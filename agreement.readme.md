# eRentKarar — Manual Agreement Fulfilment

The rental agreement service now uses document submission and manual preparation by a city-based legal / notary partner. Payment does not execute an agreement or automatically initiate e-stamping.

## Customer journey

1. Enter property, landlord, tenant and rental terms at `/rent-agreement/create`.
2. Sign in before saving the draft and submitting documents.
3. Upload landlord identity proof, tenant identity proof and property proof. Address proofs and additional supporting files are optional. PDF, PNG, JPEG and WEBP files up to 10 MB are accepted. Uploaded documents start as **Pending verification**, not verified.
4. Choose **Soft copy** or **Hard copy**. Hard copy requires a recipient, valid mobile number and complete postal address. Its additional printing, hard-copy and courier fees are configurable.
5. Pay the complete package through Razorpay. The backend determines the amount and stores the price and delivery choice with the checkout. A captured payment must match the checkout, customer, agreement, amount and currency. Repeated verification returns the same order.
6. The paid order enters **Document review**. Visit `/dashboard/orders` or `/dashboard/orders/<order-number>` to see documents, verification, corrections and the processing timeline.
7. Re-upload any rejected document from the order page. It returns to pending review; previous partner assignment is cleared until admin verifies it again.
8. Download the completed agreement PDF after admin approval. For hard copy, admin adds courier and tracking details after approval.

Soft copy delivery is an authenticated dashboard download. Automatic email delivery is not implemented by this workflow. No simulated Aadhaar OTP, automatic digital signature, or automatic stamping is required in the customer wizard.

## Admin operations

### Django admin

Open `/admin/`. Agreement Documents contains submitted files and verification statuses. Agreement Orders contains customer details, delivery fees, partner assignment, final PDF, QC status and courier information. Document files are available within the order inline.

### Web fulfilment dashboard

Open `/admin/rent-agreements` and select **Orders & Fulfilment**.

- Open **Review uploaded documents** (document icon). Download and approve each mandatory document or request a correction with a reason.
- Assign a legal partner using the city-filtered registered partner dropdown. Successful payment and verification of all three mandatory documents are required.
- Review the PDF submitted by the partner, then pass or fail QC. Approval releases the PDF to the customer; hard-copy orders enter Printing pending.
- For approved hard-copy orders, add courier provider, tracking number and dispatch / delivery status.
- Use Pricing & Delivery Fees, or Agreement Pricing Configurations in Django admin, to set the service, hard-copy, printing and courier fees and the expected SLA.

## Creating city partners

Create an account under Users in Django admin:

- Set role to **Legal / Notary Partner** (`LEGAL_PARTNER`).
- Set the partner's email, name and password. Admin-entered new passwords are hashed.
- Set User Profile → Preferred city to the property's city, for example Ahmedabad.
- Keep the account active. Staff access is unnecessary for partner work.

The partner signs in using email and password at `/login?next=/partner/agreements`. Partner login routes to `/partner/agreements`.

The dashboard shows only that account's assigned paid orders. Partners download the customer documents, start processing, request corrections, and upload a completed PDF (maximum 10 MB). A final upload goes to admin QC; partners cannot approve it or dispatch customer parcels.

## Access and storage

Files remain in Django's configured file storage. Upload and document APIs require authentication. Customers can access their own agreements; partners access their assigned paid orders; staff have administrative access. Order lookup by order number uses the same customer filtering as the order list.

Source documents use authenticated `/api/v1/agreements/document-downloads/<document-id>/` downloads. Approved PDFs use `/api/v1/agreements/orders/<order-id>/download/`. Browser downloads include the customer's JWT. Django admin file links use the staff session.

Private files under `/media/agreements/` must be routed through Django. The supplied Docker nginx configuration does this. Apply the equivalent location rule to any separately managed production nginx configuration before deployment; a direct media alias would bypass application permissions.

## Main endpoints

| Endpoint | Access / purpose |
| --- | --- |
| `GET /api/v1/agreements/pricing-config/` | Public package fees |
| `POST /api/v1/agreements/<id>/upload-document/` | Customer document upload / replacement |
| `GET /api/v1/agreements/<id>/documents/` | Authorized document list |
| `POST /api/v1/payments/create-order/` | Server-priced agreement checkout |
| `POST /api/v1/payments/verify-payment/` | Captured payment confirmation and paid order creation |
| `GET /api/v1/agreements/orders/` | Customer orders |
| `GET /api/v1/agreements/orders/<order-number>/` | Customer details and timeline |
| `PATCH /api/v1/agreements/admin-orders/<id>/verify-document/` | Staff verification / rejection |
| `GET /api/v1/agreements/admin-orders/partners/?city=<city>` | City partner directory for staff |
| `PATCH /api/v1/agreements/admin-orders/<id>/assign-partner/` | Staff partner assignment |
| `PATCH /api/v1/agreements/admin-orders/<id>/qc/` | Staff final approval |
| `PATCH /api/v1/agreements/admin-orders/<id>/update-courier/` | Staff hard-copy dispatch |
| `GET /api/v1/agreements/partner-orders/` | Assigned paid orders |
| `PATCH /api/v1/agreements/partner-orders/<id>/progress/` | Partner progress / correction request |
| `POST /api/v1/agreements/partner-orders/<id>/upload-final-doc/` | Partner completed PDF submission |

## Database and validation

New migrations:

- Accounts `0004`: legal partner role.
- Agreements `0008`: verified document status.
- Agreements `0009`: stored checkout price and delivery details.

Apply with `python manage.py migrate` from backend. These migrations have already been applied to the local database. Its pre-migration backup is `scratch/db-before-manual-fulfilment.sqlite3`.

Run backend checks with `python manage.py check`. Run agreement tests with `python manage.py test apps.agreements --noinput`. Focused tests in `tests_manual_fulfilment.py` cover document and order isolation, required verification, city assignment, partner submission, PDF integrity, QC download gating, correction re-upload, server pricing and payment replay.

Run frontend TypeScript validation with `npx tsc --noEmit` from frontend.

Razorpay integration tests mock gateway responses. A live payment, real partner preparation and actual courier delivery have not been performed by these tests. Legacy provider integrations remain in the repository but are not invoked by this customer checkout.
