from django.db.models import Sum, Count
from datetime import date
from apps.billing.models import Invoice
from apps.properties.models import Bed, Room, Property
from apps.agreements.models import Agreement
from apps.kyc.models import KYC
from apps.leads.models import Visit
from apps.tenants.models import Tenancy

class EkrarAITools:
    """
    Secure Read-Only Tool Layer for Ekrar AI.
    Never accepts arbitrary raw SQL. Every function is strictly scoped to the user's organization.
    """

    @staticmethod
    def get_pending_rent(user):
        invoices = Invoice.objects.filter(
            tenancy__property__organization__members__user=user,
            status__in=[Invoice.InvoiceStatus.ISSUED, Invoice.InvoiceStatus.OVERDUE, Invoice.InvoiceStatus.PARTIALLY_PAID]
        ).select_related("tenancy__tenant", "tenancy__property", "tenancy__room")

        results = []
        total_due = 0.0
        for inv in invoices:
            pending = inv.pending_amount
            total_due += pending
            results.append({
                "tenant_name": inv.tenancy.tenant.get_full_name() or inv.tenancy.tenant.email,
                "tenant_phone": inv.tenancy.tenant.phone_number or "N/A",
                "property": inv.tenancy.property.title,
                "room": inv.tenancy.room.room_number if inv.tenancy.room else "N/A",
                "amount_due": pending,
                "due_date": str(inv.due_date),
            })
        return {
            "total_tenants_pending": len(results),
            "total_amount_pending": total_due,
            "tenants": results[:10],
        }

    @staticmethod
    def get_vacant_inventory(user):
        beds = Bed.objects.filter(
            room__floor__building__property__organization__members__user=user,
            status=Bed.BedStatus.AVAILABLE
        ).select_related("room__floor__building__property")

        vacant_list = []
        for b in beds:
            prop = b.room.floor.building.property
            vacant_list.append({
                "property": prop.title,
                "locality": prop.locality,
                "room": b.room.room_number,
                "bed": b.bed_identifier,
                "rent": float(b.rent_amount),
            })
        return {
            "total_vacant_beds": len(vacant_list),
            "vacant_units": vacant_list[:15],
        }

    @staticmethod
    def get_monthly_collection(user):
        today = date.today()
        invoices = Invoice.objects.filter(
            tenancy__property__organization__members__user=user,
            billing_month=today.month,
            billing_year=today.year
        )
        total_billed = invoices.aggregate(Sum("total_amount"))["total_amount__sum"] or 0
        total_collected = invoices.aggregate(Sum("paid_amount"))["paid_amount__sum"] or 0

        return {
            "month": f"{today.strftime('%B %Y')}",
            "total_billed": float(total_billed),
            "total_collected": float(total_collected),
            "collection_rate_percent": round((float(total_collected) / float(total_billed) * 100), 1) if total_billed > 0 else 0,
        }

    @staticmethod
    def get_pending_kyc(user):
        pending = KYC.objects.filter(
            tenancy__property__organization__members__user=user,
            status=KYC.KYCStatus.PENDING
        ).select_related("user", "tenancy__property")

        records = []
        for k in pending:
            records.append({
                "tenant_name": k.user.get_full_name() or k.user.email,
                "property": k.tenancy.property.title if k.tenancy else "N/A",
                "submitted_at": k.created_at.strftime("%Y-%m-%d"),
            })
        return {
            "total_pending_verifications": len(records),
            "pending_tenants": records,
        }

    @staticmethod
    def get_expiring_agreements(user):
        agreements = Agreement.objects.filter(
            tenancy__property__organization__members__user=user,
            status=Agreement.AgreementStatus.COMPLETED
        ).select_related("tenancy__tenant", "tenancy__property")

        expiring = []
        for a in agreements:
            if a.tenancy.end_date:
                expiring.append({
                    "tenant": a.tenancy.tenant.email,
                    "property": a.tenancy.property.title,
                    "agreement_number": a.agreement_number,
                    "end_date": str(a.tenancy.end_date),
                })
        return {
            "total_agreements": len(expiring),
            "expiring_list": expiring[:10],
        }
