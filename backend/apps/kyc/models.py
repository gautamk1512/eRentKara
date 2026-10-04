import uuid
from django.db import models
from apps.accounts.models import User
from apps.tenants.models import Tenancy

class KYC(models.Model):
    class KYCStatus(models.TextChoices):
        NOT_SUBMITTED = "NOT_SUBMITTED", "Not Submitted"
        PENDING = "PENDING", "Pending Verification"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"
        EXPIRED = "EXPIRED", "Expired"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="kyc_records")
    tenancy = models.ForeignKey(Tenancy, on_delete=models.SET_NULL, null=True, blank=True, related_name="kyc_records")
    status = models.CharField(max_length=20, choices=KYCStatus.choices, default=KYCStatus.NOT_SUBMITTED, db_index=True)

    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="verified_kycs")
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"KYC for {self.user.email} - {self.get_status_display()}"

class KYCDocument(models.Model):
    class DocumentType(models.TextChoices):
        AADHAAR_FRONT = "AADHAAR_FRONT", "Aadhaar Card (Front)"
        AADHAAR_BACK = "AADHAAR_BACK", "Aadhaar Card (Back)"
        PAN_CARD = "PAN_CARD", "PAN Card"
        PASSPORT = "PASSPORT", "Passport"
        DRIVING_LICENSE = "DRIVING_LICENSE", "Driving Licence"
        VOTER_ID = "VOTER_ID", "Voter ID"
        POLICE_VERIFICATION = "POLICE_VERIFICATION", "Police Verification Certificate"
        STUDENT_EMP_ID = "STUDENT_EMP_ID", "Student / Employee ID"

    kyc = models.ForeignKey(KYC, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=30, choices=DocumentType.choices)
    masked_document_number = models.CharField(max_length=30, blank=True, help_text="e.g. XXXX-XXXX-4589 or ABCDE****F")
    document_file = models.FileField(upload_to="kyc_documents/%Y/%m/")
    mime_type = models.CharField(max_length=50, default="application/pdf")
    is_verified = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_document_type_display()} for KYC {self.kyc_id}"
