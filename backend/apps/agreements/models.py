import uuid
import secrets
from django.db import models
from django.utils import timezone
from apps.organizations.models import Organization
from apps.tenants.models import Tenancy
from apps.accounts.models import User
from apps.properties.models import Property

# =============================================================================
# 1. State Configuration (Legacy compatibility) & Legal Rule Engine
# =============================================================================

class StateConfiguration(models.Model):
    """
    India-Specific State/UT Stamp Duty & Registration Rules (Legacy Model)
    """
    class StampDutyType(models.TextChoices):
        FIXED = "FIXED", "Fixed Amount"
        PERCENTAGE_RENT = "PERCENTAGE_RENT", "Percentage of Annual Rent"
        SLAB = "SLAB", "Slab Based"

    state_code = models.CharField(max_length=5, unique=True, help_text="e.g. GJ, KA, MH, DL, TN, UP")
    state_name = models.CharField(max_length=100)
    stamp_duty_type = models.CharField(max_length=20, choices=StampDutyType.choices, default=StampDutyType.FIXED)
    base_stamp_duty = models.DecimalField(max_digits=10, decimal_places=2, default=300.0, help_text="In INR (₹)")
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    e_stamping_supported = models.BooleanField(default=True)
    legal_tenancy_act_reference = models.CharField(max_length=255, default="The Gujarat Tenancy Act & Model Tenancy Act, 2021")

    def __str__(self):
        return f"{self.state_name} ({self.state_code}) - ₹{self.base_stamp_duty}"


class LegalRule(models.Model):
    """
    Dynamic Legal & Stamp Duty Rule Engine for Gujarat & India
    Allows admins to update stamp duty, registration thresholds, and fees without code changes.
    """
    class AgreementType(models.TextChoices):
        RESIDENTIAL = "RESIDENTIAL", "Residential Tenancy Agreement"
        COMMERCIAL = "COMMERCIAL", "Commercial Lease Deed"
        AFFIDAVIT = "AFFIDAVIT", "Tenancy Affidavit & Undertaking"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    state_code = models.CharField(max_length=5, default="GJ", db_index=True)
    state_name = models.CharField(max_length=100, default="Gujarat")
    district = models.CharField(max_length=100, blank=True, help_text="Optional district specific rule (e.g. Ahmedabad, Surat)")
    agreement_type = models.CharField(max_length=30, choices=AgreementType.choices, default=AgreementType.RESIDENTIAL)
    property_type = models.CharField(max_length=50, default="ANY")
    
    min_duration_months = models.IntegerField(default=1)
    max_duration_months = models.IntegerField(default=60)
    
    fixed_stamp_duty = models.DecimalField(max_digits=10, decimal_places=2, default=300.0)
    rate_percentage = models.DecimalField(max_digits=5, decimal_places=3, default=0.250, help_text="Percentage of total average annual rent if applicable")
    minimum_stamp_duty = models.DecimalField(max_digits=10, decimal_places=2, default=100.0)
    
    registration_fee_fixed = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    registration_fee_percentage = models.DecimalField(max_digits=5, decimal_places=3, default=0.0)
    registration_required_threshold_months = models.IntegerField(default=12, help_text="Leases >= this duration require mandatory sub-registrar registration")
    
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=299.0)
    provider_fee = models.DecimalField(max_digits=10, decimal_places=2, default=100.0)
    
    effective_from = models.DateField(default=timezone.now)
    effective_to = models.DateField(null=True, blank=True)
    version = models.CharField(max_length=30, default="GJ-2026-V1")
    notes = models.TextField(blank=True, default="Gujarat Stamp Act 1958 Schedule I Article 30")
    source_reference = models.CharField(max_length=255, default="Gujarat Stamp Act 1958 Schedule I Article 30")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_active", "-effective_from"]

    def __str__(self):
        return f"{self.state_name} ({self.agreement_type}) - Rule {self.version}"

    def evaluate_duty(self, monthly_rent: float, deposit: float, duration_months: int):
        """
        Pure rule evaluation returning clean government, provider, platform and total fee breakdown.
        """
        annual_rent = float(monthly_rent) * min(duration_months, 12)
        total_consideration = annual_rent + (float(deposit) * 0.1)  # standard Gujarat consideration base
        
        if duration_months < self.registration_required_threshold_months:
            stamp_duty = float(self.fixed_stamp_duty)
            reg_required = False
            reg_fee = float(self.registration_fee_fixed)
        else:
            pct_duty = total_consideration * (float(self.rate_percentage) / 100.0)
            stamp_duty = max(float(self.minimum_stamp_duty), pct_duty)
            reg_required = True
            reg_fee = float(self.registration_fee_fixed) if float(self.registration_fee_fixed) > 0 else 1000.0

        provider_charges = float(self.provider_fee)
        platform_charges = float(self.platform_fee)
        total = stamp_duty + reg_fee + provider_charges + platform_charges

        return {
            "rule_id": str(self.id),
            "rule_version": self.version,
            "source_reference": self.source_reference,
            "government_stamp_duty": round(stamp_duty, 2),
            "registration_fee": round(reg_fee, 2),
            "registration_required": reg_required,
            "provider_charges": round(provider_charges, 2),
            "platform_charges": round(platform_charges, 2),
            "total_payable": round(total, 2),
            "effective_date": str(self.effective_from),
        }


# =============================================================================
# 2. Shop / Kiosk Ecosystem (Assisted Services in Gujarat)
# =============================================================================

class Shop(models.Model):
    """
    Authorized E-Seva Kendra / Cyber Cafe / Partner Kiosk Shop in Gujarat
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shop_code = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    owner_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_shops")
    city = models.CharField(max_length=100, default="Ahmedabad", db_index=True)
    district = models.CharField(max_length=100, default="Ahmedabad")
    state = models.CharField(max_length=50, default="Gujarat")
    address = models.TextField()
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    is_approved = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    commission_per_agreement = models.DecimalField(max_digits=10, decimal_places=2, default=50.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.shop_code:
            self.shop_code = f"SHP-GJ-{secrets.token_hex(3).upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} [{self.shop_code}] - {self.city}"


class ShopOperator(models.Model):
    """
    Shop Operator staff authorized to assist customers with data entry.
    """
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name="operators")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="operator_profiles")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("shop", "user")

    def __str__(self):
        return f"{self.user.email} @ {self.shop.name}"


class KioskSession(models.Model):
    """
    Assisted Kiosk Transaction Session.
    Note: Kiosk Session groups an assisted transaction, it does NOT substitute user identity.
    Owner and Tenant authenticate and sign independently.
    """
    class SessionStatus(models.TextChoices):
        ACTIVE = "ACTIVE", "Active Assisted Session"
        COMPLETED = "COMPLETED", "Completed Successfully"
        EXPIRED = "EXPIRED", "Session Expired"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_code = models.CharField(max_length=50, unique=True, db_index=True)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name="sessions")
    operator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="operated_sessions")
    owner_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="kiosk_owner_sessions")
    tenant_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="kiosk_tenant_sessions")
    status = models.CharField(max_length=20, choices=SessionStatus.choices, default=SessionStatus.ACTIVE)
    device_metadata = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    last_activity = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.session_code:
            self.session_code = f"KSK-2026-{secrets.token_hex(3).upper()}"
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(hours=4)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.session_code} ({self.shop.shop_code}) - {self.status}"


# =============================================================================
# 3. Modular Legal Clause Builder (Gujarati + English)
# =============================================================================

class AgreementClause(models.Model):
    """
    Versioned & admin-controlled bilingual clauses.
    """
    class Category(models.TextChoices):
        RENT_PAYMENT = "RENT_PAYMENT", "Rent Payment & Due Date"
        SECURITY_DEPOSIT = "SECURITY_DEPOSIT", "Security Deposit & Refund"
        MAINTENANCE = "MAINTENANCE", "Society Maintenance"
        ELECTRICITY_WATER = "ELECTRICITY_WATER", "Electricity & Utilities"
        LOCK_IN = "LOCK_IN", "Lock-in Period"
        NOTICE_PERIOD = "NOTICE_PERIOD", "Notice Period & Vacating"
        SOCIETY_RULES = "SOCIETY_RULES", "Society Bylaws & Conduct"
        PET_POLICY = "PET_POLICY", "Pet Policy"
        REPAIRS = "REPAIRS", "Structural & Internal Repairs"
        COMMERCIAL_USE = "COMMERCIAL_USE", "Commercial Usage & GST"
        TERMINATION = "TERMINATION", "Default & Legal Eviction"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=30, choices=Category.choices, db_index=True)
    title_en = models.CharField(max_length=200)
    title_gu = models.CharField(max_length=200, help_text="Gujarati Clause Title")
    title_hi = models.CharField(max_length=200, blank=True, help_text="Hindi Clause Title")
    content_en = models.TextField()
    content_gu = models.TextField(help_text="Gujarati Unicode Legal Text")
    content_hi = models.TextField(blank=True, help_text="Hindi Unicode Legal Text")
    is_mandatory = models.BooleanField(default=False)
    version = models.CharField(max_length=20, default="1.0")
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["display_order", "category"]

    def __str__(self):
        return f"{self.title_en} / {self.title_gu} ({self.category})"


# =============================================================================
# 4. Agreement Entity & State Machine
# =============================================================================

class AgreementTemplate(models.Model):
    name = models.CharField(max_length=150)
    state = models.ForeignKey(StateConfiguration, on_delete=models.SET_NULL, null=True, blank=True)
    template_text = models.TextField(help_text="Standard agreement clauses with placeholders: {{tenant_name}}, {{owner_name}}, {{property_address}}, {{monthly_rent}}, {{deposit}}, etc.")
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} [{self.state.state_name if self.state else 'Universal'}]"


class Agreement(models.Model):
    """
    Central Legal Agreement Entity with Strict State Machine
    Supports 3 modes:
    - MODE A: OWNER SELF SERVICE
    - MODE B: TENANT SELF SERVICE
    - MODE C: SHOP / KIOSK / ASSISTED MODE
    """
    class CreatorType(models.TextChoices):
        OWNER = "OWNER", "Property Owner"
        TENANT = "TENANT", "Tenant"
        SHOP = "SHOP", "Shop / Kiosk Assisted"

    class AgreementType(models.TextChoices):
        RESIDENTIAL = "RESIDENTIAL", "Residential Tenancy Agreement"
        COMMERCIAL = "COMMERCIAL", "Commercial Lease Agreement"
        AFFIDAVIT = "AFFIDAVIT", "Tenancy Affidavit"

    class Language(models.TextChoices):
        EN = "EN", "English"
        GU = "GU", "Gujarati"
        HI = "HI", "Hindi"
        BILINGUAL = "BILINGUAL", "Bilingual (Gujarati + English)"
        BILINGUAL_HI = "BILINGUAL_HI", "Bilingual (Hindi + English)"
        TRILINGUAL = "TRILINGUAL", "Trilingual (Gujarati + Hindi + English)"

    class AgreementStatus(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        OWNER_DETAILS_PENDING = "OWNER_DETAILS_PENDING", "Owner Details Pending"
        TENANT_DETAILS_PENDING = "TENANT_DETAILS_PENDING", "Tenant Details Pending"
        INVITATION_SENT = "INVITATION_SENT", "Invitation Sent to Counterparty"
        TENANT_ACCEPTED = "TENANT_ACCEPTED", "Tenant Accepted Terms"
        OWNER_VERIFICATION_PENDING = "OWNER_VERIFICATION_PENDING", "Owner Identity Verification Pending"
        TENANT_VERIFICATION_PENDING = "TENANT_VERIFICATION_PENDING", "Tenant Identity Verification Pending"
        BOTH_VERIFIED = "BOTH_VERIFIED", "Both Parties Verified"
        REVIEW_PENDING = "REVIEW_PENDING", "Agreement Review Pending"
        OWNER_SIGNING = "OWNER_SIGNING", "Awaiting Owner Digital Signature"
        TENANT_SIGNING = "TENANT_SIGNING", "Awaiting Tenant Digital Signature"
        BOTH_SIGNED = "BOTH_SIGNED", "Both Parties Signed"
        STAMPING_PENDING = "STAMPING_PENDING", "Govt e-Stamping in Progress"
        STAMPED = "STAMPED", "e-Stamped by State Treasury"
        REGISTRATION_REQUIRED = "REGISTRATION_REQUIRED", "Sub-Registrar Registration Required"
        REGISTRATION_PENDING = "REGISTRATION_PENDING", "Registration Case in Progress"
        REGISTERED = "REGISTERED", "Officially Registered"
        COMPLETED = "COMPLETED", "Completed & Legally Executed"
        CHANGE_REQUESTED = "CHANGE_REQUESTED", "Changes Requested by Party"
        CANCELLED = "CANCELLED", "Cancelled"
        EXPIRED = "EXPIRED", "Expired"
        FAILED = "FAILED", "Execution Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement_number = models.CharField(max_length=50, unique=True, editable=False, db_index=True)
    creator_type = models.CharField(max_length=20, choices=CreatorType.choices, default=CreatorType.OWNER)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_agreements", null=True, blank=True)
    
    # Independent Party Identities (Separate login sessions)
    owner_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="owner_agreements")
    tenant_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="tenant_agreements")
    
    # Assisted Kiosk Context
    shop = models.ForeignKey(Shop, on_delete=models.SET_NULL, null=True, blank=True, related_name="agreements")
    kiosk_session = models.ForeignKey(KioskSession, on_delete=models.SET_NULL, null=True, blank=True, related_name="agreements")
    
    # Backward compatibility with existing Tenancy / Property SaaS
    tenancy = models.ForeignKey(Tenancy, on_delete=models.SET_NULL, null=True, blank=True, related_name="agreements")
    property = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, blank=True, related_name="agreements")
    template = models.ForeignKey(AgreementTemplate, on_delete=models.SET_NULL, null=True, blank=True)

    # Manual Property details (allows standalone agreement drafting)
    property_title = models.CharField(max_length=255, blank=True)
    property_address = models.TextField(blank=True)
    property_city = models.CharField(max_length=100, default="Ahmedabad")
    property_state = models.CharField(max_length=50, default="Gujarat")
    property_pincode = models.CharField(max_length=10, default="380009")
    property_category = models.CharField(max_length=100, default="2BHK Residential Flat")

    # Document Classification & Localization
    agreement_type = models.CharField(max_length=30, choices=AgreementType.choices, default=AgreementType.RESIDENTIAL)
    language = models.CharField(max_length=20, choices=Language.choices, default=Language.BILINGUAL)

    # Core Financial & Tenancy Terms
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2, default=15000.0)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=30000.0)
    maintenance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=1500.0)
    duration_months = models.IntegerField(default=11)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    notice_period_days = models.IntegerField(default=30)
    lock_in_months = models.IntegerField(default=6)
    escalation_percent = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    special_clauses = models.JSONField(default=list, blank=True)

    # State Machine & Status
    status = models.CharField(max_length=35, choices=AgreementStatus.choices, default=AgreementStatus.DRAFT, db_index=True)
    change_request_notes = models.TextField(blank=True)

    # Legal Rules Engine Evaluation
    state_code = models.CharField(max_length=5, default="GJ")
    rule_applied = models.ForeignKey(LegalRule, on_delete=models.SET_NULL, null=True, blank=True)
    stamp_duty_amount = models.DecimalField(max_digits=10, decimal_places=2, default=300.0)
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=299.0)
    provider_fee = models.DecimalField(max_digits=10, decimal_places=2, default=100.0)
    total_agreement_fee = models.DecimalField(max_digits=10, decimal_places=2, default=699.0)
    registration_required = models.BooleanField(default=False)
    registration_reference = models.CharField(max_length=150, blank=True)

    # eStamp Provider Telemetry
    stamp_status = models.CharField(max_length=20, default="NOT_REQUESTED")
    stamp_provider = models.CharField(max_length=50, default="GUJARAT_ESTAMP")
    stamp_certificate_number = models.CharField(max_length=100, blank=True)
    stamp_certificate_url = models.URLField(max_length=500, blank=True)

    # eSign Provider Telemetry (e.g. Leegality, Digio)
    esign_status = models.CharField(max_length=20, default="NOT_REQUESTED")
    esign_provider = models.CharField(max_length=50, default="MOCK_ESIGN")
    esign_provider_document_id = models.CharField(max_length=150, blank=True)
    audit_trail_url = models.URLField(max_length=500, blank=True)

    # Payment Status
    payment_status = models.CharField(max_length=20, default="PENDING")

    # Document Integrity & Tamper Proofing
    agreement_html = models.TextField(blank=True)
    final_pdf = models.FileField(upload_to="agreements/pdf/%Y/%m/", null=True, blank=True)
    document_hash = models.CharField(max_length=64, blank=True, help_text="SHA-256 Hash of executed PDF")
    public_verification_token = models.CharField(max_length=64, unique=True, null=True, blank=True, editable=False)
    current_version_number = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.agreement_number:
            self.agreement_number = f"AGR-GJ-{timezone.now().year}-{secrets.token_hex(3).upper()}"
        if not self.public_verification_token:
            self.public_verification_token = uuid.uuid4().hex
        if not self.end_date and self.start_date:
            from datetime import date, datetime
            s_date = self.start_date
            if isinstance(s_date, str):
                try:
                    s_date = datetime.strptime(s_date, "%Y-%m-%d").date()
                except ValueError:
                    s_date = timezone.now().date()
            self.end_date = s_date + timezone.timedelta(days=int(self.duration_months or 11) * 30)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.agreement_number} [{self.get_status_display()}] - Rs. {self.monthly_rent}/mo"


# =============================================================================
# 5. Agreement Party & Signer Models
# =============================================================================

class AgreementParty(models.Model):
    """
    Dedicated identity entity representing a principal party in the agreement.
    Owner and Tenant maintain separate authentication & verification tracks.
    """
    class PartyType(models.TextChoices):
        OWNER = "OWNER", "Property Owner / Landlord (First Party)"
        TENANT = "TENANT", "Tenant (Second Party)"

    class VerificationStatus(models.TextChoices):
        UNVERIFIED = "UNVERIFIED", "Unverified"
        PENDING = "PENDING", "Verification In Progress"
        VERIFIED = "VERIFIED", "Identity Verified"
        REJECTED = "REJECTED", "Verification Rejected"

    class SigningStatus(models.TextChoices):
        NOT_STARTED = "NOT_STARTED", "Not Started"
        INVITATION_SENT = "INVITATION_SENT", "Invitation Sent"
        SIGNED = "SIGNED", "Digitally Signed"
        REJECTED = "REJECTED", "Signature Rejected"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="parties")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="party_records")
    party_type = models.CharField(max_length=20, choices=PartyType.choices)

    # Party Information
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    aadhaar_masked = models.CharField(max_length=20, blank=True, help_text="e.g. XXXX-XXXX-1234")
    pan_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    # Independent Identity Verification
    verification_status = models.CharField(max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.UNVERIFIED)
    verification_provider = models.CharField(max_length=50, default="AADHAAR_OTP")
    verification_reference = models.CharField(max_length=150, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    # Independent Digital Signing
    signing_status = models.CharField(max_length=20, choices=SigningStatus.choices, default=SigningStatus.NOT_STARTED)
    signing_provider = models.CharField(max_length=50, default="MOCK_ESIGN")
    sign_url = models.URLField(max_length=500, blank=True)
    signature_reference = models.CharField(max_length=150, blank=True)
    signed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("agreement", "party_type")

    def __str__(self):
        return f"{self.full_name} ({self.get_party_type_display()}) - {self.verification_status} / {self.signing_status}"


# Legacy model alias for backward compatibility
class AgreementSigner(models.Model):
    class SignerRole(models.TextChoices):
        OWNER = "OWNER", "Landlord / Owner"
        TENANT = "TENANT", "Tenant"
        WITNESS = "WITNESS", "Witness"

    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="signers")
    signer_role = models.CharField(max_length=20, choices=SignerRole.choices)
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    sign_url = models.URLField(max_length=500, blank=True)
    is_signed = models.BooleanField(default=False)
    signed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_signer_role_display()}) - {'Signed' if self.is_signed else 'Pending'}"


# =============================================================================
# 6. Agreement Versioning (Never overwrite signed documents)
# =============================================================================

class AgreementVersion(models.Model):
    """
    Immutable Version Records:
    Locks once digital signing begins. Any material modification generates a new version.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="versions")
    version_number = models.IntegerField()
    document_html = models.TextField()
    document_hash = models.CharField(max_length=64, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    change_reason = models.TextField(blank=True)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-version_number"]
        unique_together = ("agreement", "version_number")

    def __str__(self):
        return f"{self.agreement.agreement_number} v{self.version_number} {'(LOCKED)' if self.is_locked else ''}"


# =============================================================================
# 7. Secure Tokenized Invitation System
# =============================================================================

class AgreementInvitation(models.Model):
    """
    High-entropy one-time secure invitations for counter-parties.
    Never exposes predictable IDs in invitation URLs.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="invitations")
    token = models.CharField(max_length=100, unique=True, db_index=True)
    target_role = models.CharField(max_length=20, choices=AgreementParty.PartyType.choices)
    target_name = models.CharField(max_length=150)
    target_email = models.EmailField()
    target_phone = models.CharField(max_length=15)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_invitations")
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(days=7)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Invite for {self.target_name} ({self.target_role}) -> {self.agreement.agreement_number}"


# =============================================================================
# 8. Agreement Lifecycle & Audit Events
# =============================================================================

class AgreementEvent(models.Model):
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="events")
    event_type = models.CharField(max_length=50, db_index=True)
    description = models.CharField(max_length=255)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.event_type} @ {self.created_at}"


# =============================================================================
# 9. User Identity Verification Records (UIDAI / eKYC Compliant)
# =============================================================================

class UserIdentityVerification(models.Model):
    """
    Independent party Aadhaar/eKYC verification record.
    Raw OTPs are NEVER stored. Masked Aadhaar only.
    """
    class VerificationType(models.TextChoices):
        AADHAAR_OTP = "AADHAAR_OTP", "Aadhaar OTP Verification"
        AADHAAR_EKYC = "AADHAAR_EKYC", "Aadhaar eKYC (Biometric / OTP)"
        AADHAAR_OFFLINE_KYC = "AADHAAR_OFFLINE_KYC", "Aadhaar Paperless Offline e-KYC (XML)"
        DIGITAL_KYC = "DIGITAL_KYC", "Authorized Digital KYC Provider"

    class Status(models.TextChoices):
        NOT_STARTED = "NOT_STARTED", "Not Started"
        OTP_SENT = "OTP_SENT", "OTP Dispatched to UIDAI Mobile"
        OTP_VERIFIED = "OTP_VERIFIED", "OTP Verified"
        VERIFIED = "VERIFIED", "Successfully Verified"
        FAILED = "FAILED", "Verification Failed"
        EXPIRED = "EXPIRED", "Verification Expired"
        CANCELLED = "CANCELLED", "Verification Cancelled"
        PENDING = "PENDING", "Verification In Progress"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="identity_verifications")
    provider = models.CharField(max_length=50, default="AADHAAR_PROVIDER")
    provider_reference = models.CharField(max_length=150, blank=True)
    verification_type = models.CharField(max_length=30, choices=VerificationType.choices, default=VerificationType.AADHAAR_OTP)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NOT_STARTED, db_index=True)
    masked_aadhaar = models.CharField(max_length=20, help_text="e.g. XXXX-XXXX-1234")
    verified_name = models.CharField(max_length=150, blank=True)
    verified_dob = models.CharField(max_length=20, blank=True)
    verified_gender = models.CharField(max_length=10, blank=True)
    verified_address_reference = models.TextField(blank=True)
    mobile_verified = models.BooleanField(default=False)
    identity_verified = models.BooleanField(default=False)
    consent_given = models.BooleanField(default=False)
    consent_timestamp = models.DateTimeField(null=True, blank=True)
    consent_version = models.CharField(max_length=50, default="v1.0-2026")
    purpose = models.CharField(max_length=255, default="Rental Agreement Identification & e-KYC under IT Act 2000")
    verified_at = models.DateTimeField(null=True, blank=True)
    failure_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        user_identifier = self.user.email if self.user else (self.verified_name or self.masked_aadhaar or "Unassigned User")
        return f"{user_identifier} - {self.verification_type} [{self.status}]"


# =============================================================================
# 10. Digital Signing Transactions
# =============================================================================

class SigningTransaction(models.Model):
    """
    Cryptographic eSign Transaction log per party.
    Preserves SHA-256 document hash before and after execution.
    """
    class Status(models.TextChoices):
        PENDING = "PENDING", "Awaiting Signature"
        SIGNED = "SIGNED", "Successfully Signed"
        EXPIRED = "EXPIRED", "Sign URL Expired"
        FAILED = "FAILED", "Signing Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="signing_transactions")
    party = models.ForeignKey(AgreementParty, on_delete=models.SET_NULL, null=True, blank=True, related_name="signing_transactions")
    party_type = models.CharField(max_length=20, choices=AgreementParty.PartyType.choices)
    provider = models.CharField(max_length=50, default="MOCK_ESIGN")
    provider_transaction_id = models.CharField(max_length=150, blank=True, db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    sign_url = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    signed_at = models.DateTimeField(null=True, blank=True)
    provider_response_reference = models.CharField(max_length=200, blank=True)
    document_hash_before_sign = models.CharField(max_length=64, blank=True)
    document_hash_after_sign = models.CharField(max_length=64, blank=True)
    audit_reference = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.agreement.agreement_number} ({self.party_type}) - {self.status}"


# =============================================================================
# 11. Transparent Itemized Agreement Payment
# =============================================================================

class AgreementPayment(models.Model):
    """
    Itemized Payment Record separating Government Duty, Provider, Platform, Courier, and GST fees.
    """
    class PaymentStatus(models.TextChoices):
        PENDING = "PENDING", "Pending Payment"
        SUCCESS = "SUCCESS", "Payment Successful"
        FAILED = "FAILED", "Payment Failed"
        REFUNDED = "REFUNDED", "Refunded"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="agreement_payments")
    payer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="made_agreement_payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total Payable INR")
    currency = models.CharField(max_length=10, default="INR")

    # Itemized Breakdown
    government_amount = models.DecimalField(max_digits=10, decimal_places=2, default=300.0, help_text="Gujarat State Treasury Stamp Duty")
    platform_amount = models.DecimalField(max_digits=10, decimal_places=2, default=299.0, help_text="eRentKarar Platform Fee")
    provider_amount = models.DecimalField(max_digits=10, decimal_places=2, default=100.0, help_text="eStamp & eSign CRA Procurement")
    gateway_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0, help_text="Payment Gateway Fee")
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0, help_text="Statutory GST (18%)")
    courier_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0, help_text="Physical delivery fee if chosen")
    shop_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0.0, help_text="Assisted Kiosk Partner Share")

    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING, db_index=True)
    gateway = models.CharField(max_length=50, default="RAZORPAY")
    gateway_order_id = models.CharField(max_length=150, blank=True)
    gateway_payment_id = models.CharField(max_length=150, blank=True)
    invoice_id = models.CharField(max_length=100, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    refund_status = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agreement.agreement_number} - ₹{self.amount} [{self.status}]"


# =============================================================================
# 12. Physical Document Courier Delivery
# =============================================================================

class CourierOrder(models.Model):
    """
    Physical Delivery of Hardcopy e-Stamped & Executed Agreement to doorstep.
    """
    class CourierStatus(models.TextChoices):
        ORDERED = "ORDERED", "Order Placed"
        DISPATCHED = "DISPATCHED", "Dispatched from Hub"
        IN_TRANSIT = "IN_TRANSIT", "In Transit"
        DELIVERED = "DELIVERED", "Delivered to Doorstep"
        RETURNED = "RETURNED", "Returned to Sender"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="courier_orders")
    recipient_name = models.CharField(max_length=150)
    recipient_phone = models.CharField(max_length=15)
    delivery_address = models.TextField()
    city = models.CharField(max_length=100, default="Ahmedabad")
    pincode = models.CharField(max_length=10)
    state = models.CharField(max_length=50, default="Gujarat")
    provider = models.CharField(max_length=50, default="SPEED_POST", help_text="e.g. India Post Speed Post, BlueDart, Delhivery")
    tracking_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=CourierStatus.choices, default=CourierStatus.ORDERED)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=99.0)
    dispatched_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agreement.agreement_number} - Courier to {self.recipient_name} [{self.status}]"


# =============================================================================
# 13. Agreement Renewal & Lifecycle Transitions
# =============================================================================

class AgreementRenewal(models.Model):
    """
    Tracks agreement renewal without overwriting historical executed deeds.
    """
    class Status(models.TextChoices):
        REQUESTED = "REQUESTED", "Renewal Requested"
        MUTUAL_CONSENT = "MUTUAL_CONSENT", "Mutual Terms Agreed"
        EXECUTED = "EXECUTED", "New Deed Executed"
        REJECTED = "REJECTED", "Renewal Declined"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    original_agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="renewal_requests")
    renewed_agreement = models.ForeignKey(Agreement, on_delete=models.SET_NULL, null=True, blank=True, related_name="renewed_from")
    revised_rent = models.DecimalField(max_digits=10, decimal_places=2)
    revised_deposit = models.DecimalField(max_digits=10, decimal_places=2)
    renewal_duration_months = models.IntegerField(default=11)
    effective_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.REQUESTED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Renewal for {self.original_agreement.agreement_number} -> {self.status}"


# =============================================================================
# 14. Agreement Cancellation & Mutual Termination
# =============================================================================

class AgreementCancellation(models.Model):
    """
    Structured legal cancellation and vacating deed workflow.
    """
    class Status(models.TextChoices):
        PENDING = "PENDING", "Notice Served / Pending Review"
        MUTUALLY_AGREED = "MUTUALLY_AGREED", "Mutually Agreed"
        EXECUTED = "EXECUTED", "Termination Executed"
        CONTESTED = "CONTESTED", "Contested by Counterparty"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="cancellations")
    initiated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="initiated_cancellations")
    initiator_role = models.CharField(max_length=20, choices=AgreementParty.PartyType.choices)
    cancellation_reason = models.TextField()
    notice_date = models.DateField(default=timezone.now)
    effective_date = models.DateField()
    mutual_consent = models.BooleanField(default=False)
    supporting_document = models.FileField(upload_to="agreements/cancellations/%Y/%m/", null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cancellation: {self.agreement.agreement_number} [{self.status}]"


# =============================================================================
# 15. Legal Notice Workflow (Advocate / Rent Default / Eviction)
# =============================================================================

class LegalNotice(models.Model):
    """
    Formal legal notice drafting and dispatch.
    """
    class NoticeType(models.TextChoices):
        RENT_DEFAULT = "RENT_DEFAULT", "Notice for Non-Payment of Rent"
        NOTICE_TO_VACATE = "NOTICE_TO_VACATE", "Notice to Vacate (Expiry / Breach)"
        LEASE_BREACH = "LEASE_BREACH", "Notice of Breach of Covenant"
        SECURITY_REFUND_CLAIM = "SECURITY_REFUND_CLAIM", "Demand for Refund of Security Deposit"

    class DispatchMode(models.TextChoices):
        DIGITAL = "DIGITAL", "Digital Delivery (Email, SMS & WhatsApp)"
        SPEED_POST = "SPEED_POST", "Registered Speed Post AD"
        ADVOCATE_SERVED = "ADVOCATE_SERVED", "Served via Practicing Advocate"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="legal_notices")
    sender_role = models.CharField(max_length=20, choices=AgreementParty.PartyType.choices)
    recipient_role = models.CharField(max_length=20, choices=AgreementParty.PartyType.choices)
    notice_type = models.CharField(max_length=30, choices=NoticeType.choices)
    title = models.CharField(max_length=255)
    description = models.TextField()
    dispatch_mode = models.CharField(max_length=20, choices=DispatchMode.choices, default=DispatchMode.DIGITAL)
    postal_tracking_number = models.CharField(max_length=100, blank=True)
    is_acknowledged = models.BooleanField(default=False)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.notice_type} - {self.agreement.agreement_number}"
