from apps.access import ScopedModelSerializer
from rest_framework import serializers
from apps.kyc.models import KYC, KYCDocument

class KYCDocumentSerializer(ScopedModelSerializer):
    class Meta:
        model = KYCDocument
        fields = ["id", "document_type", "masked_document_number", "document_file", "mime_type", "is_verified", "uploaded_at"]
        read_only_fields = ["id", "is_verified", "uploaded_at"]

class KYCSerializer(ScopedModelSerializer):
    documents = KYCDocumentSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = KYC
        fields = [
            "id",
            "user",
            "user_email",
            "tenancy",
            "status",
            "verified_by",
            "verified_at",
            "rejection_reason",
            "documents",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "verified_by", "verified_at", "created_at", "updated_at"]
