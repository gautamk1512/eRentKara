from rest_framework import serializers
from apps.billing.models import Invoice, InvoiceItem, ElectricityReading

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ["id", "title", "amount", "category"]

class InvoiceSerializer(serializers.ModelSerializer):
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
        read_only_fields = ["id", "invoice_number", "pending_amount", "created_at"]

class ElectricityReadingSerializer(serializers.ModelSerializer):
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
