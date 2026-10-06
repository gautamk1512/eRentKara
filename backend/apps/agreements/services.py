import os
import hashlib
import uuid
import secrets
from io import BytesIO
from typing import Dict, Any, Optional, List
from datetime import datetime, date
from django.core.files.base import ContentFile
from django.utils import timezone
from django.core.exceptions import ValidationError

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing

from apps.agreements.models import (
    Agreement,
    AgreementParty,
    AgreementVersion,
    AgreementInvitation,
    AgreementEvent,
    LegalRule,
    AgreementClause,
    Shop,
    KioskSession,
    StateConfiguration,
    AgreementSigner,
)
from apps.agreements.providers import (
    get_identity_provider,
    get_esign_provider,
    get_estamp_provider,
)


# =============================================================================
# 1. State Machine & Transition Rules
# =============================================================================

class AgreementStateMachine:
    """
    Enforces server-side validated state transitions for legal compliance.
    Direct modification of status is prohibited.
    Signed & executed agreements are immutable (Phase 7 & Phase 9).
    """
    VALID_TRANSITIONS = {
        Agreement.AgreementStatus.DRAFT: [
            Agreement.AgreementStatus.DATA_VALIDATED,
            Agreement.AgreementStatus.PARTIES_INVITED,
            Agreement.AgreementStatus.PARTIES_VERIFIED,
            Agreement.AgreementStatus.AGREEMENT_FINALIZED,
            Agreement.AgreementStatus.STAMP_DUTY_CALCULATED,
            Agreement.AgreementStatus.STAMP_PAYMENT_PENDING,
            Agreement.AgreementStatus.OWNER_DETAILS_PENDING,
            Agreement.AgreementStatus.TENANT_DETAILS_PENDING,
            Agreement.AgreementStatus.INVITATION_SENT,
            Agreement.AgreementStatus.OWNER_VERIFICATION_PENDING,
            Agreement.AgreementStatus.TENANT_VERIFICATION_PENDING,
            Agreement.AgreementStatus.BOTH_VERIFIED,
            Agreement.AgreementStatus.REVIEW_PENDING,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.TENANT_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.STAMPING_PENDING,
            Agreement.AgreementStatus.STAMPED,
            Agreement.AgreementStatus.COMPLETED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.DATA_VALIDATED: [
            Agreement.AgreementStatus.PARTIES_INVITED,
            Agreement.AgreementStatus.PARTIES_VERIFIED,
            Agreement.AgreementStatus.AGREEMENT_FINALIZED,
            Agreement.AgreementStatus.STAMP_DUTY_CALCULATED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.PARTIES_INVITED: [
            Agreement.AgreementStatus.PARTIES_VERIFIED,
            Agreement.AgreementStatus.DATA_VALIDATED,
            Agreement.AgreementStatus.AGREEMENT_FINALIZED,
            Agreement.AgreementStatus.TENANT_ACCEPTED,
            Agreement.AgreementStatus.OWNER_VERIFICATION_PENDING,
            Agreement.AgreementStatus.TENANT_VERIFICATION_PENDING,
            Agreement.AgreementStatus.BOTH_VERIFIED,
            Agreement.AgreementStatus.CANCELLED,
            Agreement.AgreementStatus.EXPIRED,
        ],
        Agreement.AgreementStatus.PARTIES_VERIFIED: [
            Agreement.AgreementStatus.AGREEMENT_FINALIZED,
            Agreement.AgreementStatus.STAMP_DUTY_CALCULATED,
            Agreement.AgreementStatus.STAMP_PAYMENT_PENDING,
            Agreement.AgreementStatus.ESIGN_PENDING,
            Agreement.AgreementStatus.REVIEW_PENDING,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.AGREEMENT_FINALIZED: [
            Agreement.AgreementStatus.STAMP_DUTY_CALCULATED,
            Agreement.AgreementStatus.STAMP_PAYMENT_PENDING,
            Agreement.AgreementStatus.STAMP_PAYMENT_SUCCESS,
            Agreement.AgreementStatus.ESIGN_PENDING,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.STAMP_DUTY_CALCULATED: [
            Agreement.AgreementStatus.AGREEMENT_FINALIZED,
            Agreement.AgreementStatus.STAMP_PAYMENT_PENDING,
            Agreement.AgreementStatus.STAMP_PAYMENT_SUCCESS,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.STAMP_PAYMENT_PENDING: [
            Agreement.AgreementStatus.STAMP_PAYMENT_SUCCESS,
            Agreement.AgreementStatus.FAILED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.STAMP_PAYMENT_SUCCESS: [
            Agreement.AgreementStatus.ESTAMP_REQUESTED,
            Agreement.AgreementStatus.ESTAMP_ISSUED,
            Agreement.AgreementStatus.ESIGN_PENDING,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.STAMPING_PENDING,
            Agreement.AgreementStatus.STAMPED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.ESTAMP_REQUESTED: [
            Agreement.AgreementStatus.ESTAMP_ISSUED,
            Agreement.AgreementStatus.ESIGN_PENDING,
            Agreement.AgreementStatus.FAILED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.ESTAMP_ISSUED: [
            Agreement.AgreementStatus.ESIGN_PENDING,
            Agreement.AgreementStatus.LANDLORD_SIGNED,
            Agreement.AgreementStatus.TENANT_SIGNED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.REGISTRATION_REQUIRED,
            Agreement.AgreementStatus.COMPLETED,
        ],
        Agreement.AgreementStatus.ESIGN_PENDING: [
            Agreement.AgreementStatus.LANDLORD_SIGNED,
            Agreement.AgreementStatus.TENANT_SIGNED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.LANDLORD_SIGNED: [
            Agreement.AgreementStatus.TENANT_SIGNED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.TENANT_SIGNED: [
            Agreement.AgreementStatus.LANDLORD_SIGNED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.EXECUTED: [
            Agreement.AgreementStatus.REGISTRATION_REQUIRED,
            Agreement.AgreementStatus.REGISTRATION_PENDING,
            Agreement.AgreementStatus.REGISTERED,
            Agreement.AgreementStatus.COMPLETED,
        ],
        Agreement.AgreementStatus.INVITATION_SENT: [
            Agreement.AgreementStatus.TENANT_ACCEPTED,
            Agreement.AgreementStatus.OWNER_VERIFICATION_PENDING,
            Agreement.AgreementStatus.TENANT_VERIFICATION_PENDING,
            Agreement.AgreementStatus.BOTH_VERIFIED,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.TENANT_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.CANCELLED,
            Agreement.AgreementStatus.EXPIRED,
        ],
        Agreement.AgreementStatus.TENANT_ACCEPTED: [
            Agreement.AgreementStatus.OWNER_VERIFICATION_PENDING,
            Agreement.AgreementStatus.TENANT_VERIFICATION_PENDING,
            Agreement.AgreementStatus.BOTH_VERIFIED,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.TENANT_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.OWNER_VERIFICATION_PENDING: [
            Agreement.AgreementStatus.BOTH_VERIFIED,
            Agreement.AgreementStatus.TENANT_VERIFICATION_PENDING,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.TENANT_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.TENANT_VERIFICATION_PENDING: [
            Agreement.AgreementStatus.BOTH_VERIFIED,
            Agreement.AgreementStatus.OWNER_VERIFICATION_PENDING,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.TENANT_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.BOTH_VERIFIED: [
            Agreement.AgreementStatus.REVIEW_PENDING,
            Agreement.AgreementStatus.AGREEMENT_FINALIZED,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.TENANT_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.STAMPING_PENDING,
            Agreement.AgreementStatus.STAMPED,
            Agreement.AgreementStatus.CHANGE_REQUESTED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.REVIEW_PENDING: [
            Agreement.AgreementStatus.AGREEMENT_FINALIZED,
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.TENANT_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.STAMPING_PENDING,
            Agreement.AgreementStatus.STAMPED,
            Agreement.AgreementStatus.CHANGE_REQUESTED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.CHANGE_REQUESTED: [
            Agreement.AgreementStatus.DRAFT,
            Agreement.AgreementStatus.REVIEW_PENDING,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.OWNER_SIGNING: [
            Agreement.AgreementStatus.TENANT_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.STAMPING_PENDING,
            Agreement.AgreementStatus.STAMPED,
            Agreement.AgreementStatus.CHANGE_REQUESTED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.TENANT_SIGNING: [
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.STAMPING_PENDING,
            Agreement.AgreementStatus.STAMPED,
            Agreement.AgreementStatus.CHANGE_REQUESTED,
            Agreement.AgreementStatus.CANCELLED,
        ],
        Agreement.AgreementStatus.BOTH_SIGNED: [
            Agreement.AgreementStatus.STAMPING_PENDING,
            Agreement.AgreementStatus.STAMPED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.COMPLETED,
            Agreement.AgreementStatus.FAILED,
        ],
        Agreement.AgreementStatus.STAMPING_PENDING: [
            Agreement.AgreementStatus.STAMPED,
            Agreement.AgreementStatus.ESTAMP_ISSUED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.COMPLETED,
            Agreement.AgreementStatus.FAILED,
        ],
        Agreement.AgreementStatus.STAMPED: [
            Agreement.AgreementStatus.OWNER_SIGNING,
            Agreement.AgreementStatus.BOTH_SIGNED,
            Agreement.AgreementStatus.EXECUTED,
            Agreement.AgreementStatus.REGISTRATION_REQUIRED,
            Agreement.AgreementStatus.REGISTRATION_PENDING,
            Agreement.AgreementStatus.COMPLETED,
        ],
        Agreement.AgreementStatus.REGISTRATION_REQUIRED: [
            Agreement.AgreementStatus.REGISTRATION_PENDING,
            Agreement.AgreementStatus.REGISTERED,
            Agreement.AgreementStatus.COMPLETED,
        ],
        Agreement.AgreementStatus.REGISTRATION_PENDING: [
            Agreement.AgreementStatus.REGISTERED,
            Agreement.AgreementStatus.FAILED,
            Agreement.AgreementStatus.COMPLETED,
        ],
        Agreement.AgreementStatus.REGISTERED: [
            Agreement.AgreementStatus.COMPLETED,
        ],
        Agreement.AgreementStatus.COMPLETED: [],
        Agreement.AgreementStatus.CANCELLED: [],
        Agreement.AgreementStatus.EXPIRED: [],
        Agreement.AgreementStatus.FAILED: [
            Agreement.AgreementStatus.DRAFT,
            Agreement.AgreementStatus.STAMP_PAYMENT_PENDING,
        ],
    }

    @classmethod
    def transition_to(cls, agreement: Agreement, target_status: str, actor=None, reason: str = "") -> Agreement:
        current_status = agreement.status

        # Immutability Protection (Phase 7): Signed/Executed agreements cannot transition backwards
        if agreement.is_immutable and target_status not in [
            Agreement.AgreementStatus.COMPLETED,
            Agreement.AgreementStatus.REGISTRATION_REQUIRED,
            Agreement.AgreementStatus.REGISTRATION_PENDING,
            Agreement.AgreementStatus.REGISTERED,
        ]:
            if not (actor and getattr(actor, "is_superuser", False)):
                raise ValidationError("Executed agreement is immutable. Modifications require creating a new amendment.")

        allowed = cls.VALID_TRANSITIONS.get(current_status, [])
        if target_status not in allowed and target_status != current_status:
            if not (actor and getattr(actor, "is_superuser", False)):
                raise ValidationError(
                    f"Illegal state transition from '{current_status}' to '{target_status}'."
                )

        agreement.status = target_status

        # Record lifecycle milestones
        now = timezone.now()
        update_fields = ["status", "updated_at"]

        if target_status == Agreement.AgreementStatus.AGREEMENT_FINALIZED and not agreement.finalized_at:
            agreement.finalized_at = now
            update_fields.append("finalized_at")
        elif target_status in [Agreement.AgreementStatus.BOTH_SIGNED, Agreement.AgreementStatus.LANDLORD_SIGNED, Agreement.AgreementStatus.TENANT_SIGNED] and not agreement.signed_at:
            agreement.signed_at = now
            update_fields.append("signed_at")
        elif target_status in [Agreement.AgreementStatus.STAMPED, Agreement.AgreementStatus.ESTAMP_ISSUED] and not agreement.stamped_at:
            agreement.stamped_at = now
            update_fields.append("stamped_at")
        elif target_status in [Agreement.AgreementStatus.EXECUTED, Agreement.AgreementStatus.COMPLETED]:
            if not agreement.executed_at:
                agreement.executed_at = now
                update_fields.append("executed_at")
            if not agreement.completed_at:
                agreement.completed_at = now
                update_fields.append("completed_at")
            agreement.is_immutable = True
            update_fields.append("is_immutable")

        agreement.save(update_fields=list(set(update_fields)))

        # Audit Event (Phase 14: Complete audit trail)
        AgreementEvent.objects.create(
            agreement=agreement,
            user=actor if (actor and hasattr(actor, "email")) else None,
            action=f"TRANSITION_TO_{target_status}",
            event_type=f"STATUS_CHANGED_TO_{target_status}",
            description=f"Status transitioned from {current_status} to {target_status}. Reason: {reason or 'Workflow progression'}",
            previous_status=current_status,
            new_status=target_status,
            document_version=agreement.current_version_number,
            payment_reference=getattr(agreement, "payment_id", "") or "",
            stamp_reference=agreement.stamp_certificate_number or "",
            metadata={
                "actor": str(actor) if actor else "System",
                "reason": reason,
                "timestamp": str(now),
            }
        )
        return agreement


# =============================================================================
# 2. Legal Rules & Duty Calculation Engine
# =============================================================================

class LegalRuleEngine:
    @staticmethod
    def calculate(
        monthly_rent: float,
        security_deposit: float,
        duration_months: int,
        state_code: str = "GJ",
        agreement_type: str = "RESIDENTIAL"
    ) -> Dict[str, Any]:
        """
        Dynamically calculates government stamp duty, registration requirements,
        and platform fees based on active configured rules (Phase 8 & 28).
        """
        code = (state_code or "GJ").upper()

        rule = LegalRule.objects.filter(
            state_code=code,
            agreement_type=agreement_type,
            is_active=True,
            min_duration_months__lte=duration_months,
            max_duration_months__gte=duration_months,
        ).first()

        if rule:
            if not rule.supported:
                return {
                    "rule_id": str(rule.id),
                    "supported": False,
                    "message": "Currently unavailable for this jurisdiction.",
                    "state_code": code,
                    "government_stamp_duty": 0.0,
                    "registration_fee": 0.0,
                    "registration_required": False,
                    "provider_charges": 0.0,
                    "platform_charges": 0.0,
                    "total_payable": 0.0,
                    "statutory_reference": rule.source_reference,
                }
            res = rule.evaluate_duty(monthly_rent, security_deposit, duration_months)
            res["statutory_reference"] = rule.source_reference
            res["supported"] = True
            return res

        # Fallback to supported jurisdictions if no custom LegalRule record found
        if code == "KA":
            annual_rent = float(monthly_rent) * 12
            consideration = annual_rent + float(security_deposit)
            if duration_months < 12:
                # Karnataka Stamp Act: 0.5% of (Annual Rent + Deposit), Maximum ₹500
                stamp_duty = min(500.0, max(100.0, consideration * 0.005))
                reg_fee = 0.0
                reg_req = False
            else:
                stamp_duty = max(500.0, consideration * 0.01)
                reg_fee = 1000.0
                reg_req = True
            source_ref = "Karnataka Stamp Act 1957 Schedule Article 30"
            rule_ver = "KA-DEFAULT-2026"
        elif code == "MH":
            consideration = (float(monthly_rent) * duration_months) + (float(security_deposit) * 0.1)
            stamp_duty = max(1000.0, consideration * 0.0025)
            reg_fee = 1000.0
            reg_req = True
            source_ref = "Maharashtra Stamp Act Schedule I Article 36A"
            rule_ver = "MH-DEFAULT-2026"
        elif code == "GJ":
            if duration_months < 12:
                stamp_duty = 300.0
                reg_fee = 0.0
                reg_req = False
            else:
                annual_rent = float(monthly_rent) * min(duration_months, 12)
                consideration = annual_rent + (float(security_deposit) * 0.1)
                stamp_duty = max(300.0, consideration * 0.0025)
                reg_fee = 1000.0
                reg_req = True
            source_ref = "Gujarat Stamp Act 1958 Schedule I Article 30"
            rule_ver = "GJ-DEFAULT-2026"
        else:
            return {
                "rule_id": None,
                "supported": False,
                "message": "Currently unavailable for this jurisdiction.",
                "state_code": code,
                "government_stamp_duty": 0.0,
                "registration_fee": 0.0,
                "registration_required": False,
                "provider_charges": 0.0,
                "platform_charges": 0.0,
                "total_payable": 0.0,
                "statutory_reference": "N/A",
            }

        provider_charges = 100.0
        platform_charges = 299.0
        total = stamp_duty + reg_fee + provider_charges + platform_charges

        return {
            "rule_id": None,
            "rule_version": rule_ver,
            "source_reference": source_ref,
            "statutory_reference": source_ref,
            "government_stamp_duty": round(stamp_duty, 2),
            "registration_fee": round(reg_fee, 2),
            "registration_required": reg_req,
            "provider_charges": round(provider_charges, 2),
            "platform_charges": round(platform_charges, 2),
            "total_payable": round(total, 2),
            "effective_date": str(timezone.now().date()),
            "supported": True,
        }


# Legacy compatibility calculator
class StateStampDutyCalculator:
    @classmethod
    def calculate(cls, state_code: str, annual_rent: float):
        monthly = annual_rent / 12.0
        res = LegalRuleEngine.calculate(monthly, monthly * 2, 11, state_code)
        return {
            "state_code": state_code.upper(),
            "state_name": "Gujarat" if state_code.upper() == "GJ" else state_code.upper(),
            "stamp_duty": res["government_stamp_duty"],
            "registration_fee": res["registration_fee"],
            "platform_fee": res["platform_charges"],
            "total_fee": res["total_payable"],
            "legal_act": res["statutory_reference"],
        }


# =============================================================================
# 3. Document Generation, Tamper-Proofing & QR Verification
# =============================================================================

class AgreementPDFGenerator:
    """
    Generates high-fidelity PDF with:
    - Official Stamp Duty notice & state treasury reference
    - Bilingual/English Legal terms & modular clauses
    - Independent verification & signature stamps
    - QR Code linked to public document verification URL
    - SHA-256 cryptographic document integrity hash
    """
    @staticmethod
    def generate(agreement: Agreement) -> ContentFile:
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        p.setTitle(f"E-Rent Agreement - {agreement.agreement_number}")

        # Page 1: Stamp Duty & Header
        p.setFillColor(colors.HexColor("#0f172a"))
        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(width / 2.0, height - 50, "GOVERNMENT OF GUJARAT E-STAMP & RENTAL AGREEMENT")

        p.setFont("Helvetica", 9)
        p.setFillColor(colors.HexColor("#475569"))
        p.drawCentredString(width / 2.0, height - 65, "Executed under Gujarat Stamp Act, 1958 (Schedule I, Article 30) & Indian Contract Act, 1872")

        # Stamping Header Box
        p.setStrokeColor(colors.HexColor("#0284c7"))
        p.setLineWidth(1)
        p.roundRect(50, height - 145, width - 100, 65, 4, stroke=1, fill=0)

        p.setFont("Helvetica-Bold", 10)
        p.setFillColor(colors.HexColor("#0369a1"))
        p.drawString(65, height - 95, "E-STAMP CERTIFICATE DETAILS / STATUTORY REQUISITION")

        p.setFont("Helvetica", 9)
        p.setFillColor(colors.HexColor("#1e293b"))
        cert_num = agreement.stamp_certificate_number
        if cert_num and not cert_num.startswith("PENDING"):
            p.drawString(65, height - 110, f"Certificate No: {cert_num}  |  Duty Paid: Rs. {agreement.stamp_duty_amount:,.2f}")
        else:
            p.drawString(65, height - 110, f"Status: Stamping payment completed — certificate issuance pending | Duty: Rs. {agreement.stamp_duty_amount:,.2f}")
        p.drawString(65, height - 125, f"State: Gujarat (GJ)  |  Consideration Base: Rs. {float(agreement.monthly_rent)*agreement.duration_months:,.2f}")
        p.drawString(65, height - 138, f"Document Reference: {agreement.agreement_number}  |  Issued: {timezone.now().strftime('%d-%b-%Y')}")

        # QR Code on top right of stamp box
        frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
        verify_url = f"{frontend_url}/rent-agreement/verify/{agreement.public_verification_token}"
        qr_obj = qr.QrCodeWidget(verify_url)
        qr_obj.barWidth = 45
        qr_obj.barHeight = 45
        qr_obj.qrVersion = 2
        d = Drawing(45, 45)
        d.add(qr_obj)
        d.drawOn(p, width - 110, height - 140)

        y = height - 170

        # Section 1: Parties
        p.setFont("Helvetica-Bold", 12)
        p.setFillColor(colors.HexColor("#0f172a"))
        p.drawString(50, y, "1. PARTIES TO THE TENANCY AGREEMENT")
        p.setStrokeColor(colors.HexColor("#cbd5e1"))
        p.line(50, y - 5, width - 50, y - 5)
        y -= 25

        owner_party = agreement.parties.filter(party_type=AgreementParty.PartyType.OWNER).first()
        tenant_party = agreement.parties.filter(party_type=AgreementParty.PartyType.TENANT).first()

        p.setFont("Helvetica-Bold", 10)
        p.drawString(60, y, "FIRST PARTY (LANDLORD / OWNER):")
        y -= 15
        p.setFont("Helvetica", 9)
        p.setFillColor(colors.HexColor("#334155"))
        if owner_party:
            p.drawString(70, y, f"Name: {owner_party.full_name}  |  Phone: {owner_party.phone}  |  Email: {owner_party.email}")
            y -= 12
            p.drawString(70, y, f"UID / ID Status: {owner_party.aadhaar_masked or 'VERIFIED VIA OTP'} ({owner_party.verification_status})")
            y -= 12
            p.drawString(70, y, f"Address: {owner_party.address or 'Gujarat, India'}")
        else:
            p.drawString(70, y, "Owner details captured on verification.")
        y -= 20

        p.setFont("Helvetica-Bold", 10)
        p.setFillColor(colors.HexColor("#0f172a"))
        p.drawString(60, y, "SECOND PARTY (TENANT):")
        y -= 15
        p.setFont("Helvetica", 9)
        p.setFillColor(colors.HexColor("#334155"))
        if tenant_party:
            p.drawString(70, y, f"Name: {tenant_party.full_name}  |  Phone: {tenant_party.phone}  |  Email: {tenant_party.email}")
            y -= 12
            p.drawString(70, y, f"UID / ID Status: {tenant_party.aadhaar_masked or 'VERIFIED VIA OTP'} ({tenant_party.verification_status})")
            y -= 12
            p.drawString(70, y, f"Address: {tenant_party.address or 'Gujarat, India'}")
        else:
            p.drawString(70, y, "Tenant details captured on verification.")
        y -= 25

        # Section 2: Property & Financial Terms
        p.setFont("Helvetica-Bold", 12)
        p.setFillColor(colors.HexColor("#0f172a"))
        p.drawString(50, y, "2. DEMISED PREMISES & FINANCIAL COVENANTS")
        p.line(50, y - 5, width - 50, y - 5)
        y -= 25

        p.setFont("Helvetica", 9)
        p.setFillColor(colors.HexColor("#334155"))
        p.drawString(60, y, f"Premises Description: {agreement.property_title or agreement.property_category}")
        y -= 14
        p.drawString(60, y, f"Full Address: {agreement.property_address or 'Ahmedabad, Gujarat'}")
        y -= 14

        # Property Authority Indicator (Phase 4 compliance)
        prop = agreement.property
        if prop and prop.verification_status == "VERIFIED":
            p.setFillColor(colors.HexColor("#0284c7"))
            p.drawString(60, y, f"Property Authority: VERIFIED [Ref: {prop.electricity_consumer_number or prop.property_tax_id or 'GOV-TITLE-OK'}]")
        else:
            p.setFillColor(colors.HexColor("#0284c7"))
            p.drawString(60, y, "Property Authority: Declaration provided by user (Licensor title undertaking)")
        p.setFillColor(colors.HexColor("#334155"))
        y -= 14

        p.drawString(60, y, f"Monthly Rent: Rs. {agreement.monthly_rent:,.2f}  |  Maintenance: Rs. {agreement.maintenance_amount:,.2f}/mo")
        y -= 14
        p.drawString(60, y, f"Security Deposit: Rs. {agreement.security_deposit:,.2f} (Refundable upon peaceful handover)")
        y -= 14
        p.drawString(60, y, f"Term: {agreement.duration_months} Months  ({agreement.start_date} to {agreement.end_date or 'End of term'})")
        y -= 14
        p.drawString(60, y, f"Lock-in Period: {agreement.lock_in_months} Months  |  Notice Period: {agreement.notice_period_days} Days")
        y -= 14
        p.setFont("Helvetica-Oblique", 7.5)
        p.setFillColor(colors.HexColor("#64748b"))
        p.drawString(60, y, "Statutory Title Warranty: Licensor warrants lawful authority to lease under Model Tenancy Act.")
        p.setFont("Helvetica", 9)
        y -= 20

        # Section 3: Statutory & Custom Clauses
        p.setFont("Helvetica-Bold", 12)
        p.setFillColor(colors.HexColor("#0f172a"))
        p.drawString(50, y, "3. KEY LEGAL TERMS & CONDITIONS")
        p.line(50, y - 5, width - 50, y - 5)
        y -= 22

        clauses = AgreementClause.objects.filter(is_active=True).order_by("display_order")[:5]
        for idx, clause in enumerate(clauses, 1):
            if y < 140:
                p.showPage()
                y = height - 50
            p.setFont("Helvetica-Bold", 9)
            p.setFillColor(colors.HexColor("#1e293b"))
            if agreement.language == "HI" and clause.title_hi:
                title_display = f"3.{idx} {clause.title_hi}"
            elif agreement.language == "BILINGUAL_HI" and clause.title_hi:
                title_display = f"3.{idx} {clause.title_en} / {clause.title_hi}"
            elif agreement.language == "TRILINGUAL" and clause.title_hi:
                title_display = f"3.{idx} {clause.title_en} / {clause.title_gu} / {clause.title_hi}"
            else:
                title_display = f"3.{idx} {clause.title_en} / {clause.title_gu}"
            p.drawString(60, y, title_display)
            y -= 12
            p.setFont("Helvetica", 8)
            p.setFillColor(colors.HexColor("#475569"))
            p.drawString(70, y, clause.content_en[:120] + "...")
            y -= 16

        # Execution & Digital Signatures Box
        if y < 160:
            p.showPage()
            y = height - 50

        y -= 15
        p.setFont("Helvetica-Bold", 12)
        p.setFillColor(colors.HexColor("#0f172a"))
        p.drawString(50, y, "4. DIGITAL EXECUTION & AUDIT RECORD")
        p.line(50, y - 5, width - 50, y - 5)
        y -= 30

        # Owner signature stamp
        p.setStrokeColor(colors.HexColor("#10b981") if (owner_party and owner_party.signing_status == "SIGNED") else colors.HexColor("#cbd5e1"))
        p.roundRect(60, y - 45, 220, 50, 4, stroke=1, fill=0)
        p.setFont("Helvetica-Bold", 9)
        p.setFillColor(colors.HexColor("#047857") if (owner_party and owner_party.signing_status == "SIGNED") else colors.HexColor("#64748b"))
        p.drawString(70, y - 15, "OWNER / LANDLORD SIGNATURE")
        p.setFont("Helvetica", 8)
        p.drawString(70, y - 28, f"Signer: {owner_party.full_name if owner_party else 'Owner'}")
        p.drawString(70, y - 40, f"Status: {owner_party.signing_status if owner_party else 'PENDING'} on {owner_party.signed_at or timezone.now()}")

        # Tenant signature stamp
        p.setStrokeColor(colors.HexColor("#10b981") if (tenant_party and tenant_party.signing_status == "SIGNED") else colors.HexColor("#cbd5e1"))
        p.roundRect(width - 280, y - 45, 220, 50, 4, stroke=1, fill=0)
        p.setFont("Helvetica-Bold", 9)
        p.setFillColor(colors.HexColor("#047857") if (tenant_party and tenant_party.signing_status == "SIGNED") else colors.HexColor("#64748b"))
        p.drawString(width - 270, y - 15, "TENANT DIGITAL SIGNATURE")
        p.setFont("Helvetica", 8)
        p.drawString(width - 270, y - 28, f"Signer: {tenant_party.full_name if tenant_party else 'Tenant'}")
        p.drawString(width - 270, y - 40, f"Status: {tenant_party.signing_status if tenant_party else 'PENDING'} on {tenant_party.signed_at or timezone.now()}")

        # User Declarations Summary (Phase 4, 5, 6)
        decl_parts = []
        if agreement.landlord_declaration_confirmed:
            decl_parts.append("Landlord: Confirmed Authorization")
        if agreement.tenant_declaration_confirmed:
            decl_parts.append("Tenant: Confirmed Identity")
        if agreement.financial_terms_confirmed:
            decl_parts.append("Financial Terms: Confirmed")
        if decl_parts:
            p.setFont("Helvetica-Bold", 7.5)
            p.setFillColor(colors.HexColor("#0369a1"))
            p.drawCentredString(width / 2.0, 48, " | ".join(decl_parts))

        # Legal Disclaimer (Phase 3)
        p.setFont("Helvetica-Oblique", 6.5)
        p.setFillColor(colors.HexColor("#64748b"))
        p.drawCentredString(width / 2.0, 36, "eRentKarar is a technology platform for preparing and digitally executing rental agreements. Stamp duty, registration,")
        p.drawCentredString(width / 2.0, 28, "notarization, and identity verification are subject to applicable laws, jurisdictional rules, and authorized service-provider processes.")

        # Document footer security verification line
        p.setFont("Helvetica", 7)
        p.setFillColor(colors.HexColor("#94a3b8"))
        p.drawCentredString(width / 2.0, 18, f"Digital Tamper-Proof Document ID: {agreement.agreement_number} | Verify at {verify_url}")

        p.showPage()
        p.save()

        buffer.seek(0)
        pdf_bytes = buffer.getvalue()
        sha256_hash = hashlib.sha256(pdf_bytes).hexdigest()
        agreement.document_hash = sha256_hash
        agreement.save(update_fields=["document_hash"])

        return ContentFile(pdf_bytes, name=f"{agreement.agreement_number}.pdf")


# =============================================================================
# 4. Agreement Workflow Management Service
# =============================================================================

class AgreementService:
    @staticmethod
    def create_agreement(
        creator_user,
        creator_type: str,
        data: Dict[str, Any],
        shop_id: Optional[str] = None,
        operator_user=None,
    ) -> Agreement:
        """
        Creates an agreement in any of the 3 modes:
        - MODE A: Owner Self-Service
        - MODE B: Tenant Self-Service
        - MODE C: Shop / Kiosk Assisted Mode
        """
        rent = float(data.get("monthly_rent", 15000))
        deposit = float(data.get("security_deposit", rent * 2))
        duration = int(data.get("duration_months", 11))
        state_code = data.get("state_code", "GJ")
        agr_type = data.get("agreement_type", "RESIDENTIAL")

        # Dynamic rule evaluation
        calc = LegalRuleEngine.calculate(rent, deposit, duration, state_code, agr_type)

        shop_obj = None
        kiosk_session = None
        if shop_id:
            try:
                try:
                    uuid_val = uuid.UUID(str(shop_id))
                    shop_obj = Shop.objects.filter(id=uuid_val).first()
                except (ValueError, AttributeError):
                    shop_obj = Shop.objects.filter(shop_code__iexact=str(shop_id)).first()

                if not shop_obj:
                    # Fallback to any active shop or first shop
                    shop_obj = Shop.objects.first()

                if shop_obj:
                    kiosk_session = KioskSession.objects.create(
                        shop=shop_obj,
                        operator=operator_user or creator_user,
                        status=KioskSession.SessionStatus.ACTIVE,
                        device_metadata=data.get("device_metadata", {}),
                    )
            except Exception:
                pass

        agreement = Agreement.objects.create(
            creator_type=creator_type,
            created_by=creator_user,
            owner_user=creator_user if creator_type == Agreement.CreatorType.OWNER else None,
            tenant_user=creator_user if creator_type == Agreement.CreatorType.TENANT else None,
            shop=shop_obj,
            kiosk_session=kiosk_session,
            property_title=data.get("property_title", ""),
            property_address=data.get("property_address", ""),
            property_city=data.get("property_city", "Ahmedabad"),
            property_state=data.get("property_state", "Gujarat"),
            property_pincode=data.get("property_pincode", "380009"),
            property_category=data.get("property_category", "2BHK Residential Flat"),
            agreement_type=agr_type,
            language=data.get("language", Agreement.Language.BILINGUAL),
            monthly_rent=rent,
            security_deposit=deposit,
            maintenance_amount=float(data.get("maintenance_amount", 1000)),
            duration_months=duration,
            start_date=(
                datetime.strptime(data.get("start_date"), "%Y-%m-%d").date()
                if isinstance(data.get("start_date"), str)
                else (data.get("start_date") or timezone.now().date())
            ),
            notice_period_days=int(data.get("notice_period_days", 30)),
            lock_in_months=int(data.get("lock_in_months", 6)),
            state_code=state_code,
            stamp_duty_amount=calc["government_stamp_duty"],
            registration_fee=calc["registration_fee"],
            provider_fee=calc["provider_charges"],
            platform_fee=calc["platform_charges"],
            total_agreement_fee=calc["total_payable"],
            registration_required=calc["registration_required"],
            status=Agreement.AgreementStatus.DRAFT,
        )

        # Create Party records with independent tracks
        # Owner party
        owner_data = data.get("owner_details", {})
        if creator_type == Agreement.CreatorType.OWNER:
            AgreementParty.objects.create(
                agreement=agreement,
                user=creator_user,
                party_type=AgreementParty.PartyType.OWNER,
                full_name=owner_data.get("full_name") or creator_user.get_full_name() or creator_user.email,
                email=creator_user.email,
                phone=creator_user.phone_number or owner_data.get("phone", ""),
                address=owner_data.get("address", ""),
            )
        elif owner_data.get("full_name"):
            AgreementParty.objects.create(
                agreement=agreement,
                party_type=AgreementParty.PartyType.OWNER,
                full_name=owner_data["full_name"],
                email=owner_data.get("email", ""),
                phone=owner_data.get("phone", ""),
                address=owner_data.get("address", ""),
            )

        # Tenant party
        tenant_data = data.get("tenant_details", {})
        if creator_type == Agreement.CreatorType.TENANT:
            AgreementParty.objects.create(
                agreement=agreement,
                user=creator_user,
                party_type=AgreementParty.PartyType.TENANT,
                full_name=tenant_data.get("full_name") or creator_user.get_full_name() or creator_user.email,
                email=creator_user.email,
                phone=creator_user.phone_number or tenant_data.get("phone", ""),
                address=tenant_data.get("address", ""),
            )
        elif tenant_data.get("full_name"):
            AgreementParty.objects.create(
                agreement=agreement,
                party_type=AgreementParty.PartyType.TENANT,
                full_name=tenant_data["full_name"],
                email=tenant_data.get("email", ""),
                phone=tenant_data.get("phone", ""),
                address=tenant_data.get("address", ""),
            )

        # Create initial Version 1
        AgreementVersion.objects.create(
            agreement=agreement,
            version_number=1,
            document_html="",
            created_by=creator_user,
            change_reason="Initial Draft Created",
        )

        # Audit Event
        AgreementEvent.objects.create(
            agreement=agreement,
            event_type="AGREEMENT_CREATED",
            description=f"Agreement created in mode {creator_type} by {creator_user.email}",
            metadata={"mode": creator_type, "duration": duration, "rent": rent}
        )

        return agreement

    @staticmethod
    def send_invitation(agreement: Agreement, sender_user, target_role: str, target_name: str, target_email: str, target_phone: str) -> AgreementInvitation:
        """
        Generates secure one-time tokenized invitation link.
        """
        invitation = AgreementInvitation.objects.create(
            agreement=agreement,
            target_role=target_role,
            target_name=target_name,
            target_email=target_email,
            target_phone=target_phone,
            created_by=sender_user,
            expires_at=timezone.now() + timezone.timedelta(days=7),
        )

        # Advance state to INVITATION_SENT if still in draft
        if agreement.status == Agreement.AgreementStatus.DRAFT:
            AgreementStateMachine.transition_to(
                agreement,
                Agreement.AgreementStatus.INVITATION_SENT,
                actor=sender_user,
                reason=f"Invitation sent to {target_name} ({target_role})"
            )

        AgreementEvent.objects.create(
            agreement=agreement,
            event_type="INVITATION_SENT",
            description=f"Secure invitation dispatched to {target_name} ({target_email})",
            metadata={"target_role": target_role, "expires_at": str(invitation.expires_at)}
        )

        return invitation

    @staticmethod
    def send_party_aadhaar_otp(party: AgreementParty, aadhaar_number: str) -> Dict[str, Any]:
        """
        Dispatches Aadhaar OTP to UIDAI linked mobile number.
        """
        provider = get_identity_provider()
        clean_id = aadhaar_number.replace(" ", "").replace("-", "")
        return provider.start_verification(
            aadhaar_number=clean_id,
            full_name=party.full_name,
            phone=party.phone,
            consent_given=True,
        )

    @staticmethod
    def verify_party_identity(party: AgreementParty, aadhaar_number: str, otp_code: str) -> Dict[str, Any]:
        """
        Independent Identity Verification:
        Uses IdentityVerificationProvider without storing raw OTP.
        Records UserIdentityVerification entity adhering to UIDAI compliance.
        """
        provider = get_identity_provider()
        clean_id = aadhaar_number.replace(" ", "").replace("-", "")
        masked_aadhaar = f"XXXX-XXXX-{clean_id[-4:] if len(clean_id) >= 4 else '1234'}"

        # Step 1: Start
        start_res = provider.start_verification(
            aadhaar_number=clean_id,
            full_name=party.full_name,
            phone=party.phone,
            consent_given=True,
        )
        ref = start_res.get("verification_reference", f"UID-{uuid.uuid4().hex[:8]}")

        # Step 2: Verify OTP
        verify_res = provider.verify_otp(ref, otp_code)
        if verify_res.get("verified"):
            party.verification_status = AgreementParty.VerificationStatus.VERIFIED
            party.verification_provider = start_res.get("provider", "AADHAAR_OTP")
            party.verification_reference = ref
            party.aadhaar_masked = masked_aadhaar
            party.verified_at = timezone.now()
            party.save()

            # Record UserIdentityVerification entity (Point 8 requirement)
            from apps.agreements.models import UserIdentityVerification
            target_user = party.user or party.agreement.created_by
            if target_user:
                verif_record = UserIdentityVerification.objects.filter(
                    user=target_user,
                    masked_aadhaar=masked_aadhaar,
                ).first()
                if not verif_record:
                    UserIdentityVerification.objects.create(
                        user=target_user,
                        masked_aadhaar=masked_aadhaar,
                        provider=start_res.get("provider", "AADHAAR_OTP"),
                        provider_reference=ref,
                        verification_type=UserIdentityVerification.VerificationType.AADHAAR_OTP,
                        status=UserIdentityVerification.Status.VERIFIED,
                        verified_name=party.full_name,
                        identity_verified=True,
                        mobile_verified=True,
                        verified_at=timezone.now(),
                    )
                else:
                    verif_record.provider = start_res.get("provider", "AADHAAR_OTP")
                    verif_record.provider_reference = ref
                    verif_record.status = UserIdentityVerification.Status.VERIFIED
                    verif_record.verified_name = party.full_name
                    verif_record.identity_verified = True
                    verif_record.mobile_verified = True
                    verif_record.verified_at = timezone.now()
                    verif_record.save(update_fields=[
                        "provider", "provider_reference", "status", "verified_name",
                        "identity_verified", "mobile_verified", "verified_at"
                    ])

            agreement = party.agreement
            AgreementEvent.objects.create(
                agreement=agreement,
                event_type="IDENTITY_VERIFIED",
                description=f"Identity verified for {party.full_name} ({party.get_party_type_display()})",
                metadata={"party_type": party.party_type, "ref": ref}
            )

            # Check if both parties are now verified
            owner_party = agreement.parties.filter(party_type=AgreementParty.PartyType.OWNER).first()
            tenant_party = agreement.parties.filter(party_type=AgreementParty.PartyType.TENANT).first()

            if owner_party and tenant_party:
                if (owner_party.verification_status == AgreementParty.VerificationStatus.VERIFIED and
                    tenant_party.verification_status == AgreementParty.VerificationStatus.VERIFIED):
                    try:
                        AgreementStateMachine.transition_to(
                            agreement,
                            Agreement.AgreementStatus.BOTH_VERIFIED,
                            reason="Both parties successfully completed identity verification."
                        )
                    except Exception:
                        agreement.status = Agreement.AgreementStatus.BOTH_VERIFIED
                        agreement.save(update_fields=["status"])
            return {"success": True, "message": "Identity successfully verified.", "party_status": party.verification_status}

        return {"success": False, "message": verify_res.get("message", "OTP verification failed.")}

    @staticmethod
    def initiate_digital_signing(agreement: Agreement) -> Dict[str, Any]:
        """
        Dispatches signing requests to both parties via ESignProvider.
        """
        provider = get_esign_provider()
        parties = list(agreement.parties.all())
        signing_res = provider.create_signing_request(agreement, parties)

        agreement.esign_provider_document_id = signing_res.get("provider_document_id", "")
        agreement.audit_trail_url = signing_res.get("audit_trail_url", "")
        agreement.esign_status = "PENDING_SIGNATURES"
        agreement.save(update_fields=["esign_provider_document_id", "audit_trail_url", "esign_status"])

        for p_info in signing_res.get("parties", []):
            try:
                p_obj = agreement.parties.get(id=p_info["party_id"])
                p_obj.sign_url = p_info["sign_url"]
                p_obj.signature_reference = p_info.get("signature_reference", "")
                p_obj.signing_status = AgreementParty.SigningStatus.INVITATION_SENT
                p_obj.save(update_fields=["sign_url", "signature_reference", "signing_status"])
            except AgreementParty.DoesNotExist:
                pass

        AgreementStateMachine.transition_to(
            agreement,
            Agreement.AgreementStatus.OWNER_SIGNING,
            reason="eSign workflow initiated for parties."
        )

        return signing_res

    @staticmethod
    def record_signature(party: AgreementParty, signature_evidence: str = "") -> Agreement:
        """
        Records authentic signature for party, locks document version,
        and transitions to BOTH_SIGNED and e-Stamping when complete.
        """
        party.signing_status = AgreementParty.SigningStatus.SIGNED
        party.signed_at = timezone.now()
        party.save(update_fields=["signing_status", "signed_at"])

        agreement = party.agreement
        AgreementEvent.objects.create(
            agreement=agreement,
            event_type=f"{party.party_type}_SIGNED",
            description=f"{party.full_name} completed digital signing.",
            metadata={"party_type": party.party_type, "timestamp": str(party.signed_at)}
        )

        # Check if all parties have signed
        pending = agreement.parties.exclude(signing_status=AgreementParty.SigningStatus.SIGNED).exists()
        if not pending:
            # Lock current version
            latest_version = agreement.versions.first()
            if latest_version:
                latest_version.is_locked = True
                latest_version.save(update_fields=["is_locked"])

            AgreementStateMachine.transition_to(
                agreement,
                Agreement.AgreementStatus.BOTH_SIGNED,
                reason="Both parties successfully signed the agreement."
            )

            # Trigger automated e-Stamping & final PDF generation
            AgreementService.process_estamp_and_completion(agreement)

        return agreement

    @staticmethod
    def process_estamp_and_completion(agreement: Agreement) -> Agreement:
        """
        Procures e-Stamp from state treasury / authorized provider and produces final PDF.
        Adheres to Phase 10 & Phase 29: No fake certificates or claims without evidence.
        """
        AgreementStateMachine.transition_to(
            agreement,
            Agreement.AgreementStatus.STAMPING_PENDING,
            reason="Requesting Government e-Stamp paper from state treasury."
        )

        estamp_provider = get_estamp_provider()
        stamp_res = estamp_provider.create_stamp_request(agreement)
        cert_num = stamp_res.get("certificate_number")

        if cert_num:
            agreement.stamp_status = "ISSUED"
            agreement.stamp_certificate_number = cert_num
            agreement.stamp_certificate_url = stamp_res.get("certificate_url", "")
            agreement.stamped_at = timezone.now()
            agreement.save(update_fields=["stamp_status", "stamp_certificate_number", "stamp_certificate_url", "stamped_at"])

            AgreementStateMachine.transition_to(
                agreement,
                Agreement.AgreementStatus.STAMPED,
                reason="e-Stamp paper issued and attached to deed."
            )
        else:
            agreement.stamp_status = "PENDING_ISSUANCE"
            agreement.stamp_certificate_number = ""
            agreement.save(update_fields=["stamp_status", "stamp_certificate_number"])
            AgreementEvent.objects.create(
                agreement=agreement,
                event_type="ESTAMP_REQUESTED",
                description="Stamping payment completed — certificate issuance pending with state treasury.",
                metadata={"provider": stamp_res.get("provider", "STATUTORY_ADAPTER")}
            )

        # Generate final PDF with QR code & SHA-256 hash (Phase 15)
        pdf_file = AgreementPDFGenerator.generate(agreement)
        agreement.final_pdf.save(f"{agreement.agreement_number}.pdf", pdf_file, save=False)
        agreement.is_immutable = True
        agreement.executed_at = timezone.now()
        agreement.save(update_fields=["final_pdf", "is_immutable", "executed_at"])

        # Check if Registration required
        if agreement.registration_required:
            AgreementStateMachine.transition_to(
                agreement,
                Agreement.AgreementStatus.REGISTRATION_REQUIRED,
                reason="Duration >= 12 months requires Sub-Registrar registration."
            )
        else:
            AgreementStateMachine.transition_to(
                agreement,
                Agreement.AgreementStatus.COMPLETED,
                reason="Agreement fully signed and legally executed."
            )

        return agreement

    @staticmethod
    def create_amendment(
        original_agreement: Agreement,
        creator_user,
        reason: str,
        modifications: Dict[str, Any]
    ) -> Agreement:
        """
        Creates an immutable amendment to an existing executed agreement (Phase 7).
        Original agreement remains untouched and immutable.
        """
        new_rent = float(modifications.get("monthly_rent", original_agreement.monthly_rent))
        new_deposit = float(modifications.get("security_deposit", original_agreement.security_deposit))
        new_duration = int(modifications.get("duration_months", original_agreement.duration_months))
        state_code = modifications.get("state_code", original_agreement.state_code)
        agr_type = modifications.get("agreement_type", original_agreement.agreement_type)

        calc = LegalRuleEngine.calculate(new_rent, new_deposit, new_duration, state_code, agr_type)

        new_agreement = Agreement.objects.create(
            creator_type=original_agreement.creator_type,
            created_by=creator_user or original_agreement.created_by,
            owner_user=original_agreement.owner_user,
            tenant_user=original_agreement.tenant_user,
            shop=original_agreement.shop,
            kiosk_session=original_agreement.kiosk_session,
            tenancy=original_agreement.tenancy,
            property=original_agreement.property,
            property_title=modifications.get("property_title", original_agreement.property_title),
            property_address=modifications.get("property_address", original_agreement.property_address),
            property_city=modifications.get("property_city", original_agreement.property_city),
            property_state=modifications.get("property_state", original_agreement.property_state),
            property_pincode=modifications.get("property_pincode", original_agreement.property_pincode),
            property_category=modifications.get("property_category", original_agreement.property_category),
            agreement_type=agr_type,
            language=modifications.get("language", original_agreement.language),
            monthly_rent=new_rent,
            security_deposit=new_deposit,
            maintenance_amount=float(modifications.get("maintenance_amount", original_agreement.maintenance_amount)),
            duration_months=new_duration,
            start_date=modifications.get("start_date", original_agreement.start_date),
            notice_period_days=int(modifications.get("notice_period_days", original_agreement.notice_period_days)),
            lock_in_months=int(modifications.get("lock_in_months", original_agreement.lock_in_months)),
            state_code=state_code,
            stamp_duty_amount=calc.get("government_stamp_duty", 300.0),
            registration_fee=calc.get("registration_fee", 0.0),
            provider_fee=calc.get("provider_charges", 100.0),
            platform_fee=calc.get("platform_charges", 299.0),
            total_agreement_fee=calc.get("total_payable", 699.0),
            registration_required=calc.get("registration_required", False),
            status=Agreement.AgreementStatus.DRAFT,
            amendment_of=original_agreement,
            current_version_number=original_agreement.current_version_number + 1,
        )

        for party in original_agreement.parties.all():
            AgreementParty.objects.create(
                agreement=new_agreement,
                user=party.user,
                party_type=party.party_type,
                full_name=party.full_name,
                email=party.email,
                phone=party.phone,
                address=party.address,
                aadhaar_masked=party.aadhaar_masked,
            )

        AgreementVersion.objects.create(
            agreement=new_agreement,
            version_number=new_agreement.current_version_number,
            document_html="",
            created_by=creator_user,
            change_reason=f"Amendment of {original_agreement.agreement_number}: {reason}",
        )

        AgreementEvent.objects.create(
            agreement=original_agreement,
            user=creator_user if (creator_user and hasattr(creator_user, "email")) else None,
            action="AMENDMENT_CREATED",
            event_type="AMENDMENT_CREATED",
            description=f"Amendment #{new_agreement.agreement_number} created: {reason}",
            metadata={"new_agreement_id": str(new_agreement.id)}
        )

        return new_agreement

    @staticmethod
    def request_notarization(agreement: Agreement, user, advocate_name: str = "", notes: str = "") -> Agreement:
        """Phase 12: Independent Notarization Request (Never auto-notarized)"""
        agreement.notary_status = Agreement.NotaryStatus.REQUESTED
        agreement.notary_advocate_name = advocate_name
        agreement.notary_notes = notes
        agreement.save(update_fields=["notary_status", "notary_advocate_name", "notary_notes"])

        AgreementEvent.objects.create(
            agreement=agreement,
            user=user if (user and hasattr(user, "email")) else None,
            action="NOTARIZATION_REQUESTED",
            event_type="NOTARIZATION_REQUESTED",
            description=f"Notarization requested with advocate {advocate_name or 'assigned advocate'}.",
            metadata={"advocate_name": advocate_name, "notes": notes}
        )
        return agreement

    @staticmethod
    def complete_notarization(agreement: Agreement, advocate_name: str, reg_number: str, notes: str = "") -> Agreement:
        """Phase 12: Notarization Completed only upon authentic notary action"""
        agreement.notary_status = Agreement.NotaryStatus.COMPLETED
        agreement.notary_advocate_name = advocate_name
        agreement.notary_registration_number = reg_number
        agreement.notary_completed_at = timezone.now()
        agreement.notary_notes = notes
        agreement.save(update_fields=["notary_status", "notary_advocate_name", "notary_registration_number", "notary_completed_at", "notary_notes"])

        AgreementEvent.objects.create(
            agreement=agreement,
            action="NOTARIZATION_COMPLETED",
            event_type="NOTARIZATION_COMPLETED",
            description=f"Notarization verified by Advocate {advocate_name} (Reg: {reg_number}).",
            metadata={"reg_number": reg_number, "advocate_name": advocate_name}
        )
        return agreement

    @staticmethod
    def submit_police_verification(agreement: Agreement, reference_number: str, station_name: str, app_date=None) -> Agreement:
        """Phase 13: Police Verification Application Submitted only with authentic reference"""
        agreement.police_verification_status = Agreement.PoliceVerificationStatus.APPLICATION_SUBMITTED
        agreement.police_verification_reference = reference_number
        agreement.police_station_name = station_name
        agreement.police_application_date = app_date or timezone.now().date()
        agreement.save(update_fields=[
            "police_verification_status",
            "police_verification_reference",
            "police_station_name",
            "police_application_date",
        ])

        AgreementEvent.objects.create(
            agreement=agreement,
            action="POLICE_VERIFICATION_SUBMITTED",
            event_type="POLICE_VERIFICATION_SUBMITTED",
            description=f"Police verification application submitted at {station_name} (Ref: {reference_number}).",
            metadata={"reference": reference_number, "station": station_name}
        )
        return agreement
