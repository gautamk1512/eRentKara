from datetime import date
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from django.core.files.base import ContentFile
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.billing.models import Invoice, InvoiceItem, ElectricityReading
from apps.billing.serializers import InvoiceSerializer, ElectricityReadingSerializer
from apps.tenants.models import Tenancy

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "SUPER_ADMIN":
            return Invoice.objects.all().select_related("tenancy__tenant", "tenancy__property")
        elif user.role == "TENANT":
            return Invoice.objects.filter(tenancy__tenant=user).select_related("tenancy__tenant", "tenancy__property")
        return Invoice.objects.filter(tenancy__property__organization__members__user=user).distinct().select_related("tenancy__tenant", "tenancy__property")

    @action(detail=False, methods=["post"])
    def generate_monthly_invoices(self, request):
        """
        Generates current monthly invoices for all active tenancies in the organization.
        """
        today = date.today()
        month = int(request.data.get("month", today.month))
        year = int(request.data.get("year", today.year))

        active_tenancies = Tenancy.objects.filter(
            property__organization__members__user=request.user,
            status=Tenancy.TenancyStatus.ACTIVE
        ).distinct()

        created_count = 0
        for tenancy in active_tenancies:
            # Check if invoice already exists for this month/year
            exists = Invoice.objects.filter(tenancy=tenancy, billing_month=month, billing_year=year).exists()
            if not exists:
                total = (
                    tenancy.monthly_rent +
                    tenancy.property.maintenance_charges
                )
                due_day = 5
                try:
                    due = date(year, month, due_day)
                except ValueError:
                    due = date(year, month, 1)

                inv = Invoice.objects.create(
                    tenancy=tenancy,
                    billing_month=month,
                    billing_year=year,
                    base_rent=tenancy.monthly_rent,
                    maintenance_charges=tenancy.property.maintenance_charges,
                    total_amount=total,
                    due_date=due,
                    status=Invoice.InvoiceStatus.ISSUED,
                )
                InvoiceItem.objects.create(invoice=inv, title="Base Monthly Rent", amount=tenancy.monthly_rent, category="RENT")
                if tenancy.property.maintenance_charges > 0:
                    InvoiceItem.objects.create(invoice=inv, title="Maintenance Fee", amount=tenancy.property.maintenance_charges, category="MAINTENANCE")

                created_count += 1

        return Response({
            "success": True,
            "message": f"Successfully generated {created_count} invoices for {month}/{year}."
        })

    @action(detail=True, methods=["post"])
    def generate_receipt(self, request, pk=None):
        invoice = self.get_object()
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setTitle(f"Receipt - {invoice.invoice_number}")

        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 750, "RENT PAYMENT RECEIPT")
        p.setFont("Helvetica", 10)
        p.drawString(100, 735, f"Receipt No: {invoice.invoice_number} | eRentKarar.com")
        p.drawString(100, 720, f"Tenant: {invoice.tenancy.tenant.email} | Property: {invoice.tenancy.property.title}")
        p.line(100, 710, 500, 710)

        p.drawString(100, 680, f"Billing Period: {invoice.billing_month:02d}/{invoice.billing_year}")
        p.drawString(100, 665, f"Base Rent: Rs. {invoice.base_rent:,.2f}")
        p.drawString(100, 650, f"Maintenance: Rs. {invoice.maintenance_charges:,.2f}")
        p.drawString(100, 635, f"Electricity / Utilities: Rs. {invoice.electricity_charges:,.2f}")
        p.setFont("Helvetica-Bold", 12)
        p.drawString(100, 610, f"Total Amount Paid: Rs. {invoice.paid_amount:,.2f} [PAID]")

        p.showPage()
        p.save()

        buffer.seek(0)
        invoice.pdf_receipt.save(f"receipt_{invoice.invoice_number}.pdf", ContentFile(buffer.getvalue()), save=True)
        return Response({"success": True, "receipt_url": invoice.pdf_receipt.url if invoice.pdf_receipt else None})

class ElectricityReadingViewSet(viewsets.ModelViewSet):
    serializer_class = ElectricityReadingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ElectricityReading.objects.filter(property__organization__members__user=user).distinct()
