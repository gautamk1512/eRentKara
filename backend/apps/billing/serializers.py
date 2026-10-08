from apps.access import ScopedModelSerializer
from rest_framework import serializers
from apps.billing.models import Invoice, InvoiceItem, ElectricityReading

class InvoiceItemSerializer(ScopedModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ["id", "title", "amount", "category"]

class InvoiceSerializer(ScopedModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    tenant_name = serializers.CharField(source="tenancy.tenant.get_full_name", read_only=True)
    tenant_email = serializers.CharField(source="tenancy.tenant.email", read_only=True)
    property_title = serializers.CharField(source="tenancy.property.title", read_only=True)
    room_number = serializers.CharField(source="tenancy.room.room_number", read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "invoice_number",
            "tenancy",
            "tenant_name",
            "tenant_email",
            "property_title",
            "room_number",
            "billing_month",
            "billing_year",
            "base_rent",
            "maintenance_charges",
            "electricity_charges",
            "water_charges",
            "mess_charges",
            "late_fee",
            "adjustments_or_discount",
            "total_amount",
            "paid_amount",
            "pending_amount",
            "due_date",
            "status",
            "items",
            "pdf_receipt",
            "created_at",
        ]
        read_only_fields = ["id", "invoice_number", "pending_amount", "paid_amount", "pdf_receipt", "created_at"]

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if attrs.get('status') in {'PAID', 'PARTIALLY_PAID'}:
            raise serializers.ValidationError('Payment status is set by verified checkout.')
        month = attrs.get('billing_month', getattr(self.instance, 'billing_month', 1))
        if not 1 <= month <= 12:
            raise serializers.ValidationError({'billing_month': 'Month must be between 1 and 12.'})
        return attrs

class ElectricityReadingSerializer(ScopedModelSerializer):
    units_consumed = serializers.SerializerMethodField()
    total_cost = serializers.SerializerMethodField()

    class Meta:
        model = ElectricityReading
        fields = [
            "id",
            "property",
            "room",
            "meter_number",
            "previous_reading",
            "current_reading",
            "rate_per_unit",
            "reading_date",
            "units_consumed",
            "total_cost",
        ]

    def get_units_consumed(self, obj):
        return obj.get_units_consumed()

    def get_total_cost(self, obj):
        return obj.get_total_cost()
