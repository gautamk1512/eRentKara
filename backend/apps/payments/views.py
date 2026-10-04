import uuid
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

            order_id = f"order_{uuid.uuid4().hex[:12]}"
            payment = Payment.objects.create(
                organization=invoice.tenancy.property.organization,
                tenancy=invoice.tenancy,
                invoice=invoice,
                amount=invoice.total_amount,
                payment_type=Payment.PaymentType.RENT,
                payment_method=payment_method,
                status=Payment.PaymentStatus.CREATED,
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
                    "key_id": "rzp_test_eRentKararSandbox",
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
