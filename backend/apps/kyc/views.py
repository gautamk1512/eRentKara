from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.kyc.models import KYC, KYCDocument
from apps.kyc.serializers import KYCSerializer, KYCDocumentSerializer

class KYCViewSet(viewsets.ModelViewSet):
    serializer_class = KYCSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "SUPER_ADMIN":
            return KYC.objects.all().prefetch_related("documents")
        elif user.role == "TENANT":
            return KYC.objects.filter(user=user).prefetch_related("documents")
        return KYC.objects.filter(tenancy__property__organization__members__user=user).distinct().prefetch_related("documents")

    @action(detail=False, methods=["get"])
    def my_kyc(self, request):
        kyc, _ = KYC.objects.get_or_create(user=request.user)
        return Response({"success": True, "data": KYCSerializer(kyc).data})

    @action(detail=True, methods=["post"])
    def upload_document(self, request, pk=None):
        kyc = self.get_object()
        doc_type = request.data.get("document_type")
        masked_num = request.data.get("masked_document_number", "")
        file_obj = request.FILES.get("file")

        if not doc_type or not file_obj:
            return Response(
                {"success": False, "error": {"code": "VALIDATION_ERROR", "message": "document_type and file are required."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        doc = KYCDocument.objects.create(
            kyc=kyc,
            document_type=doc_type,
            masked_document_number=masked_num,
            document_file=file_obj,
            mime_type=file_obj.content_type or "application/pdf",
        )
        kyc.status = KYC.KYCStatus.PENDING
        kyc.save()

        return Response({"success": True, "message": "Document uploaded successfully.", "data": KYCDocumentSerializer(doc).data})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def verify(self, request, pk=None):
        kyc = self.get_object()
        approved = request.data.get("approved", True)
        notes = request.data.get("rejection_reason", "")

        if approved:
            kyc.status = KYC.KYCStatus.VERIFIED
            kyc.verified_by = request.user
            kyc.verified_at = timezone.now()
            kyc.rejection_reason = ""
        else:
            kyc.status = KYC.KYCStatus.REJECTED
            kyc.rejection_reason = notes

        kyc.save()
        return Response({"success": True, "status": kyc.status, "message": f"KYC marked as {kyc.get_status_display()}."})
