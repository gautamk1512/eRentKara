import re
import logging
import uuid
import hmac
import hashlib
from decimal import Decimal
import razorpay
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.payments.models import Payment, PaymentAttempt
from apps.payments.serializers import PaymentSerializer
from apps.billing.models import Invoice
from apps.bookings.models import Booking
from apps.audit.models import AuditLog
from apps.agreements.models import (
    Agreement,
    AgreementPayment,
    AgreementEvent,
    AgreementOrder,
    AgreementPricingConfig,
    OrderEvent,
    AgreementDocument,
)
from apps.organizations.models import Organization
from apps.agreements.fulfilment import can_access_agreement, REQUIRED_DOCUMENTS


def get_razorpay_client():
    key_id = getattr(settings, "RAZORPAY_KEY_ID", "rzp_test_TkF3p3IhDpNxpI")
    key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "YASfPXG4lSh12cMhKYI9i20G")
    return razorpay.Client(auth=(key_id, key_secret))


class CreateRazorpayOrderView(APIView):
    """
    Step 1: Backend - Create Order
    Endpoint: POST /api/create-order
    Call Razorpay API: POST https://api.razorpay.com/v1/orders
    Request: { amount (paise), currency, receipt }
    Return: { order_id, amount, currency }
    Minimum amount: 100 paise
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        amount = request.data.get("amount")
        currency = request.data.get("currency", "INR")
        receipt = request.data.get("receipt") or f"rcpt_{uuid.uuid4().hex[:10]}"
        notes = request.data.get("notes") or {}
        agreement_id = request.data.get("agreement_id")
        invoice_id = request.data.get("invoice_id")

        checkout = None
        if agreement_id:
            agreement = Agreement.objects.filter(pk=agreement_id).first()
            if not agreement or not can_access_agreement(request.user, agreement):
                return Response({"error": "Sign in to your own agreement before payment."}, status=403)
            uploaded = set(agreement.documents.exclude(status__in=["INVALID", "MISSING"]).values_list("document_type", flat=True))
            if not REQUIRED_DOCUMENTS.issubset(uploaded):
                return Response({"error": "Upload the landlord ID, tenant ID and property proof first."}, status=400)
            delivery = request.data.get("delivery_type", "SOFT_COPY")
            if delivery not in AgreementOrder.DeliveryType.values:
                return Response({"error": "Invalid delivery type."}, status=400)
            config = AgreementPricingConfig.get_active()
            checkout = {"delivery_type": delivery, "service": str(config.service_fee), "hard_copy": str(config.hard_copy_fee if delivery == "HARD_COPY" else 0), "courier": str(config.courier_fee if delivery == "HARD_COPY" else 0), "printing": str(config.printing_fee if delivery == "HARD_COPY" else 0)}
            shipping_fields = ["recipient_name", "recipient_phone", "delivery_address", "delivery_city", "delivery_state", "delivery_pincode"]
            checkout["shipping"] = {key: str(request.data.get(key) or "").strip() for key in shipping_fields}
            if delivery == "HARD_COPY":
                shipping = checkout["shipping"]
                if not all(shipping.values()) or not re.fullmatch(r"[6-9]\d{9}", shipping["recipient_phone"]) or not re.fullmatch(r"[1-9]\d{5}", shipping["delivery_pincode"]):
                    return Response({"error": "A complete delivery address, valid mobile and pincode are required."}, status=400)
            amount = int(sum(Decimal(checkout[k]) for k in ["service", "hard_copy", "courier", "printing"]) * 100)

        if not agreement_id and not invoice_id:
            return Response({"error": "Complete the agreement form and upload documents before payment."}, status=400)
        if agreement_id:
            notes["agreement_id"] = str(agreement_id)
        if invoice_id:
            notes["invoice_id"] = str(invoice_id)

        # Validate amount >= 100 paise
        if amount is None:
            return Response(
                {"error": "Amount is required.", "code": "INVALID_AMOUNT"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            amount_paise = int(amount)
        except (ValueError, TypeError):
            return Response(
                {"error": "Amount must be a valid integer in paise.", "code": "INVALID_AMOUNT"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if amount_paise < 100:
            return Response(
                {"error": "Amount must be at least 100 paise (₹1.00).", "code": "MIN_AMOUNT_NOT_MET"},
                status=status.HTTP_400_BAD_REQUEST
            )

        key_id = getattr(settings, "RAZORPAY_KEY_ID", "rzp_test_TkF3p3IhDpNxpI")
        key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "YASfPXG4lSh12cMhKYI9i20G")

        try:
            client = razorpay.Client(auth=(key_id, key_secret))
            order_data = {
                "amount": amount_paise,
                "currency": currency,
                "receipt": str(receipt),
                "notes": notes,
            }
            order = client.order.create(data=order_data)
        except razorpay.errors.AuthenticationError as auth_err:
            return Response(
                {"error": f"Authentication failed with Razorpay: {str(auth_err)}", "code": "AUTH_FAILURE"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as err:
            err_str = str(err)
            if "401" in err_str or "unauthorized" in err_str.lower() or "authentication" in err_str.lower():
                return Response(
                    {"error": f"Razorpay authentication error: {err_str}", "code": "AUTH_FAILURE"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            return Response(
                {"error": f"Razorpay API error: {err_str}", "code": "RAZORPAY_API_ERROR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if checkout is not None:
            AgreementPayment.objects.create(agreement=agreement, payer=request.user, amount=Decimal(amount_paise) / 100, currency=currency, gateway_order_id=order["id"], checkout_details=checkout)

        # Store payment intent in DB if possible
        try:
            org = None
            if agreement_id:
                agr = Agreement.objects.filter(id=agreement_id).first()
                if agr and hasattr(agr, "property") and agr.property:
                    org = agr.property.organization
            if not org:
                org = Organization.objects.first()

            if org:
                Payment.objects.create(
                    organization=org,
                    amount=Decimal(amount_paise) / Decimal(100),
                    payment_type=Payment.PaymentType.AGREEMENT_FEE if agreement_id else Payment.PaymentType.RENT,
                    payment_method=Payment.PaymentMethod.UPI,
                    status=Payment.PaymentStatus.CREATED,
                    gateway_name="RAZORPAY",
                    gateway_order_id=order["id"],
                )
        except Exception:
            pass

        return Response({
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": key_id,
            "receipt": order.get("receipt", receipt),
        }, status=status.HTTP_201_CREATED)


class VerifyRazorpayPaymentView(APIView):
    """
    Step 3: Backend - Verify Signature
    Endpoint: POST /api/verify-payment
    Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    Compare generated signature with razorpay_signature
    Return success only if signatures match
    """
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        order_id = request.data.get("razorpay_order_id") or request.data.get("order_id")
        payment_id = request.data.get("razorpay_payment_id") or request.data.get("payment_id")
        signature = request.data.get("razorpay_signature") or request.data.get("signature")
        agreement_id = request.data.get("agreement_id")
        invoice_id = request.data.get("invoice_id")

        if not agreement_id and not invoice_id:
            return Response({"error": "An agreement or invoice is required."}, status=400)

        # Validate missing fields: return 400
        if not order_id or not payment_id or not signature:
            missing = []
            if not order_id:
                missing.append("order_id")
            if not payment_id:
                missing.append("payment_id")
            if not signature:
                missing.append("signature")
            return Response(
                {"error": f"Missing required fields: {', '.join(missing)}", "code": "MISSING_FIELDS"},
                status=status.HTTP_400_BAD_REQUEST
            )

        key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "YASfPXG4lSh12cMhKYI9i20G")
        msg = f"{order_id}|{payment_id}".encode("utf-8")
        generated_signature = hmac.new(
            key_secret.encode("utf-8"),
            msg,
            hashlib.sha256
        ).hexdigest()

        # Signature mismatch: return 400, do NOT mark as paid
        if not hmac.compare_digest(generated_signature, signature):
            return Response(
                {
                    "error": "Signature mismatch. Payment verification failed.",
                    "code": "SIGNATURE_MISMATCH",
                    "verified": False,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            gateway_payment = get_razorpay_client().payment.fetch(payment_id)
        except Exception:
            return Response({"error": "Payment confirmation is temporarily unavailable. Retry with the same payment reference."}, status=502)
        if gateway_payment.get("order_id") != order_id or gateway_payment.get("status") != "captured":
            return Response({"error": "Payment has not been captured for this order."}, status=400)

        intent = None
        if agreement_id:
            intent = AgreementPayment.objects.select_for_update().filter(gateway_order_id=order_id, agreement_id=agreement_id).first()
            if not intent or not can_access_agreement(request.user, intent.agreement) or intent.payer_id != request.user.pk:
                return Response({"error": "Payment order does not belong to this agreement and customer."}, status=403)
            existing = AgreementOrder.objects.filter(payment_order_id=order_id).first()
            if existing:
                if existing.payment_id != payment_id:
                    return Response({"error": "This checkout was already paid."}, status=409)
                return Response({"verified": True, "order_number": existing.order_number, "order": existing.get_customer_view(), "redirect_url": f"/dashboard/orders/{existing.order_number}"})
            if gateway_payment.get("amount") != int(intent.amount * 100) or gateway_payment.get("currency") != intent.currency:
                return Response({"error": "Payment amount or currency does not match checkout."}, status=400)
            if not intent.checkout_details:
                return Response({"error": "Missing checkout details. Start payment again."}, status=400)

        # Signatures match: update payment records in database
        payment_record = Payment.objects.filter(gateway_order_id=order_id).first()
        if payment_record:
            payment_record.status = Payment.PaymentStatus.SUCCESS
            payment_record.gateway_payment_id = payment_id
            payment_record.gateway_signature = signature
            payment_record.is_reconciled = True
            payment_record.reconciled_at = timezone.now()
            payment_record.save()

            if payment_record.invoice:
                payment_record.invoice.paid_amount = payment_record.amount
                payment_record.invoice.status = Invoice.InvoiceStatus.PAID
                payment_record.invoice.save()

        # Handle agreement payment update and order creation if agreement_id is provided
        created_order_data = None
        if agreement_id:
            try:
                agreement = Agreement.objects.filter(id=agreement_id).first()
                if agreement:
                    agreement.payment_status = "SUCCESS"
                    agreement.save(update_fields=["payment_status"])

                    shipping = intent.checkout_details.get("shipping", {})

                    # Fetch active pricing
                    pricing_cfg = AgreementPricingConfig.get_active()
                    delivery_type = intent.checkout_details["delivery_type"] if intent else request.data.get("delivery_type", "SOFT_COPY")
                    if delivery_type not in ["SOFT_COPY", "HARD_COPY"]:
                        delivery_type = "SOFT_COPY"

                    svc_amt = Decimal(intent.checkout_details["service"])
                    hard_copy_amt = Decimal(intent.checkout_details["hard_copy"])
                    courier_amt = Decimal(intent.checkout_details["courier"])
                    printing_amt = Decimal(intent.checkout_details["printing"])
                    calculated_total = intent.amount
                    intent.status = "SUCCESS"
                    intent.gateway_payment_id = payment_id
                    intent.paid_at = timezone.now()
                    intent.save()

                    AgreementEvent.objects.create(
                        agreement=agreement,
                        event_type="PAYMENT_RECEIVED",
                        description=f"Razorpay Standard Checkout payment received. Payment ID: {payment_id}",
                        metadata={"payment_id": payment_id, "order_id": order_id, "amount": float(calculated_total)}
                    )

                    # Section 33: Idempotent AgreementOrder Creation
                    order = AgreementOrder.objects.filter(payment_id=payment_id).first()
                    if not order:
                        customer_user = None
                        if request.user and request.user.is_authenticated:
                            customer_user = request.user
                        elif agreement.owner_user:
                            customer_user = agreement.owner_user
                        elif agreement.tenant_user:
                            customer_user = agreement.tenant_user

                        order = AgreementOrder.objects.create(
                            agreement=agreement,
                            customer=customer_user,
                            delivery_type=delivery_type,
                            status=AgreementOrder.OrderStatus.DOCUMENT_REVIEW,
                            recipient_name=shipping.get("recipient_name", request.data.get("recipient_name", "")) or (agreement.owner_user.get_full_name() if agreement.owner_user else ""),
                            recipient_phone=shipping.get("recipient_phone", request.data.get("recipient_phone", "")) or getattr(customer_user, "phone_number", "") or "",
                            delivery_address=shipping.get("delivery_address", request.data.get("delivery_address", "")) or agreement.property_address,
                            delivery_city=shipping.get("delivery_city", request.data.get("delivery_city", "")) or agreement.property_city,
                            delivery_state=shipping.get("delivery_state", request.data.get("delivery_state", "")) or agreement.property_state,
                            delivery_pincode=shipping.get("delivery_pincode", request.data.get("delivery_pincode", "")) or agreement.property_pincode,
                            service_amount=svc_amt,
                            hard_copy_fee=hard_copy_amt,
                            courier_fee=courier_amt,
                            printing_fee=printing_amt,
                            total_amount=calculated_total,
                            payment_status="SUCCESS",
                            payment_id=payment_id,
                            payment_order_id=order_id,
                            paid_at=timezone.now(),
                            expected_completion_at=timezone.now() + timezone.timedelta(days=pricing_cfg.expected_sla_days),
                        )

                        # Link any existing pre-uploaded documents
                        AgreementDocument.objects.filter(agreement=agreement, order__isnull=True).update(order=order)

                        # Create Timeline Events (Section 31 & 32)
                        OrderEvent.objects.create(
                            order=order,
                            user=customer_user,
                            role=getattr(customer_user, "role", "CUSTOMER") if customer_user else "CUSTOMER",
                            action="ORDER_CREATED",
                            previous_status="",
                            new_status=AgreementOrder.OrderStatus.ORDER_CREATED,
                            reference_id=order.order_number,
                            notes="Order registered in system",
                            is_customer_visible=True,
                        )
                        OrderEvent.objects.create(
                            order=order,
                            user=customer_user,
                            role="PAYMENT_GATEWAY",
                            action="PAYMENT_CONFIRMED",
                            previous_status=AgreementOrder.OrderStatus.ORDER_CREATED,
                            new_status=AgreementOrder.OrderStatus.DOCUMENT_REVIEW,
                            reference_id=payment_id,
                            notes=f"Razorpay payment confirmed (₹{calculated_total}). Delivery: {order.get_delivery_type_display()}",
                            is_customer_visible=True,
                        )

                    created_order_data = {
                        "order_id": str(order.id),
                        "order_number": order.order_number,
                        "status": order.status,
                        "delivery_type": order.delivery_type,
                        "delivery_label": order.get_delivery_type_display(),
                        "expected_completion": "Expected completion within 7 days.",
                        "redirect_url": f"/dashboard/orders/{order.order_number}",
                    }
            except Exception:
                logging.getLogger(__name__).exception("Unable to persist verified agreement order")
                transaction.set_rollback(True)
                return Response({"error": "Unable to save the paid order. Retry verification with the same payment reference."}, status=500)

        response_payload = {
            "success": True,
            "message": "Payment verified successfully.",
            "order_id": order_id,
            "payment_id": payment_id,
            "verified": True,
        }
        if created_order_data:
            response_payload["order"] = created_order_data
            response_payload["order_number"] = created_order_data["order_number"]
            response_payload["redirect_url"] = created_order_data["redirect_url"]

        return Response(response_payload, status=status.HTTP_200_OK)


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "SUPER_ADMIN":
            return Payment.objects.all()
        elif user.role == "TENANT":
            return Payment.objects.filter(tenancy__tenant=user)
        return Payment.objects.filter(organization__members__user=user).distinct()

    @action(detail=False, methods=["post"])
    def create_checkout_order(self, request):
        """
        Creates a payment intent for Razorpay / UPI / Cashfree.
        """
        invoice_id = request.data.get("invoice_id")
        booking_id = request.data.get("booking_id")
        payment_method = request.data.get("payment_method", "UPI")

        if invoice_id:
            try:
                invoice = Invoice.objects.get(id=invoice_id)
            except Invoice.DoesNotExist:
                return Response({"success": False, "error": {"code": "NOT_FOUND", "message": "Invoice not found"}}, status=status.HTTP_404_NOT_FOUND)

            amount_paise = int(float(invoice.total_amount) * 100)
            key_id = getattr(settings, "RAZORPAY_KEY_ID", "rzp_test_TkF3p3IhDpNxpI")
            key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", "YASfPXG4lSh12cMhKYI9i20G")
            order_id = f"order_{uuid.uuid4().hex[:12]}"

            if key_id and key_secret:
                try:
                    client = razorpay.Client(auth=(key_id, key_secret))
                    rzp_order = client.order.create(data={
                        "amount": amount_paise,
                        "currency": "INR",
                        "receipt": f"inv_{invoice.id.hex[:8]}",
                        "notes": {"invoice_id": str(invoice.id)}
                    })
                    order_id = rzp_order["id"]
                except Exception as e:
                    print(f"Razorpay order fallback: {e}")

            payment = Payment.objects.create(
                organization=invoice.tenancy.property.organization,
                tenancy=invoice.tenancy,
                invoice=invoice,
                amount=invoice.total_amount,
                payment_type=Payment.PaymentType.RENT,
                payment_method=payment_method,
                status=Payment.PaymentStatus.CREATED,
                gateway_name="RAZORPAY",
                gateway_order_id=order_id,
            )

            return Response({
                "success": True,
                "message": "Payment order initialized.",
                "data": {
                    "payment_id": str(payment.id),
                    "receipt_number": payment.receipt_number,
                    "amount": float(payment.amount),
                    "currency": "INR",
                    "order_id": order_id,
                    "key_id": key_id,
                }
            })

        return Response({"success": False, "error": {"code": "VALIDATION_ERROR", "message": "invoice_id is required."}}, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    @action(detail=True, methods=["post"])
    def confirm_payment(self, request, pk=None):
        """
        Confirms payment execution, marks invoice as PAID, and logs audit trail.
        """
        payment = self.get_object()
        gateway_payment_id = request.data.get("gateway_payment_id", f"pay_{uuid.uuid4().hex[:10]}")

        payment.status = Payment.PaymentStatus.SUCCESS
        payment.gateway_payment_id = gateway_payment_id
        payment.reconciled_at = timezone.now()
        payment.is_reconciled = True
        payment.save()

        # Update linked invoice
        if payment.invoice:
            payment.invoice.paid_amount = payment.amount
            payment.invoice.status = Invoice.InvoiceStatus.PAID
            payment.invoice.save()

        # Audit log
        AuditLog.objects.create(
            user=request.user,
            organization=payment.organization,
            action="PAYMENT_RECEIVED",
            entity_name="Payment",
            entity_id=str(payment.id),
            details={"amount": str(payment.amount), "receipt": payment.receipt_number},
        )

        return Response({
            "success": True,
            "message": "Payment successfully confirmed and reconciled!",
            "data": PaymentSerializer(payment).data
        })


class PaymentWebhookView(APIView):
    """
    Idempotent Server-to-Server Payment Webhook Handler.
    """
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        event_id = request.headers.get("X-Razorpay-Event-Id") or request.data.get("event_id") or str(uuid.uuid4())
        
        # Idempotency check: don't process duplicate webhook
        if PaymentAttempt.objects.filter(provider_event_id=event_id).exists():
            return Response({"status": "already_processed"}, status=status.HTTP_200_OK)

        order_id = request.data.get("payload", {}).get("payment", {}).get("entity", {}).get("order_id")
        payment = Payment.objects.filter(gateway_order_id=order_id).first() if order_id else None

        if payment:
            PaymentAttempt.objects.create(
                payment=payment,
                provider_event_id=event_id,
                raw_payload=request.data,
                is_verified=True
            )
            payment.status = Payment.PaymentStatus.SUCCESS
            payment.save()

        return Response({"status": "acknowledged"}, status=status.HTTP_200_OK)
