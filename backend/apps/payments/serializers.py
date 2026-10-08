from apps.access import ScopedModelSerializer
from rest_framework import serializers
from apps.payments.models import Payment, PaymentAttempt

class PaymentSerializer(ScopedModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "receipt_number",
            "organization",
            "tenancy",
            "invoice",
            "booking",
            "amount",
            "payment_type",
            "payment_method",
            "status",
            "gateway_name",
            "gateway_order_id",
            "gateway_payment_id",
            "created_at",
        ]
        read_only_fields = ["id", "receipt_number", "created_at"]
