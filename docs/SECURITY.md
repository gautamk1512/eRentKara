# eRentKarar — Security & Compliance Architecture

## 1. Multi-Tenant Scoping & Zero-IDOR Principle
In eRentKarar, data belongs to an `Organization`. Every viewset overrides `get_queryset()` to enforce object-level isolation:
```python
def get_queryset(self):
    user = self.request.user
    if user.role == "SUPER_ADMIN":
        return Entity.objects.all()
    return Entity.objects.filter(
        property__organization__members__user=user,
        property__organization__members__is_active=True
    ).distinct()
```
Users cannot access or modify records of another organization by manipulating URL IDs or request bodies.

---

## 2. Double-Booking Protection & Concurrency Safety
Inventory race conditions are prevented at the database level:
- Database transactions use `transaction.atomic()`
- Target `Bed` records are locked using `select_for_update()` before verifying status and creating reservation records.
- If two users attempt to reserve the same bed concurrently, the second transaction waits and receives an HTTP 409 Conflict.

---

## 3. KYC Data Isolation & Masked Storage
- Identity documents (Aadhaar, PAN, Passports) are uploaded to private storage buckets.
- Identifiers are stored in masked format (e.g. `XXXX-XXXX-4589` or `ABCDE****F`).
- Files are accessed only via short-lived signed URLs with 15-minute expiration. Public bucket access is strictly disabled.

---

## 4. Ekrar AI Prompt-Injection & Authorization Defense
- The AI assistant operates strictly on predefined Python tool functions (`EkrarAITools`).
- Never executes dynamic SQL strings constructed from prompt text.
- Tool queries are scoped to the authenticated user's organization.
- **Sensitive Action Safeguard**: High-impact operations (such as sending bulk WhatsApp notices or financial changes) cannot be executed directly by AI text output; they are created in `status=PREPARED` and require explicit user click confirmation before execution.

---

## 5. Webhook Idempotency & Financial Immutability
- Payment webhooks track incoming event IDs in `PaymentAttempt.provider_event_id`.
- Duplicate webhooks return HTTP 200 without reprocessing.
- All financial transactions update append-only ledgers and write to `AuditLog`.
