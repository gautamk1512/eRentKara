"""Authenticated, city-based manual agreement fulfilment."""
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from apps.accounts.models import User
from .models import AgreementDocument, AgreementOrder, OrderEvent
from .serializers import AgreementOrderDetailSerializer


REQUIRED_DOCUMENTS = {"LANDLORD_ID", "TENANT_ID", "PROPERTY_DOC"}


def can_access_agreement(user, agreement, partner=False):
    if not user.is_authenticated:
        return False
    if user.is_staff or user.pk in (agreement.created_by_id, agreement.owner_user_id, agreement.tenant_user_id):
        return True
    return partner and AgreementOrder.objects.filter(agreement=agreement, assigned_partner=user, payment_status="SUCCESS").exists()


class PartnerOrderViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AgreementOrderDetailSerializer

    def get_queryset(self):
        return AgreementOrder.objects.filter(assigned_partner=self.request.user, payment_status="SUCCESS").select_related("agreement")

    @action(detail=True, methods=["patch"])
    def progress(self, request, pk=None):
        with transaction.atomic():
            order = self.get_queryset().select_for_update().get(pk=self.get_object().pk)
            next_status = request.data.get("status")
            transitions = {
                "PARTNER_ASSIGNED": {"AGREEMENT_PROCESSING", "CORRECTION_REQUIRED"},
                "AGREEMENT_PROCESSING": {"CORRECTION_REQUIRED"},
            }
            if next_status not in transitions.get(order.status, set()):
                raise ValidationError("This status change is not allowed.")
            previous = order.status
            notes = str(request.data.get("notes", "")).strip()
            if next_status == "CORRECTION_REQUIRED" and not notes:
                raise ValidationError("Explain which documents need correction.")
            order.status = next_status
            order.correction_reason = notes if next_status == "CORRECTION_REQUIRED" else ""
            order.save()
            OrderEvent.objects.create(order=order, user=request.user, role="PARTNER", action="PARTNER_PROGRESS", previous_status=previous, new_status=next_status, notes=notes)
        return Response({"success": True})

    @action(detail=True, methods=["post"], url_path="upload-final-doc")
    def upload_final_doc(self, request, pk=None):
        from .views import AdminAgreementOrderViewSet
        order = self.get_object()
        if order.status not in {"PARTNER_ASSIGNED", "AGREEMENT_PROCESSING", "CORRECTION_REQUIRED", "FINAL_DOCUMENT_PENDING"}:
            raise ValidationError("This order cannot accept a new final document.")
        return AdminAgreementOrderViewSet.upload_final_doc(self, request, pk)


class DocumentDownloadViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, pk=None):
        doc = get_object_or_404(AgreementDocument, pk=pk)
        if not can_access_agreement(request.user, doc.agreement, partner=True):
            self.permission_denied(request)
        return FileResponse(doc.file.open("rb"), as_attachment=True, filename=doc.file_name)


def partner_directory(city):
    users = User.objects.filter(role="LEGAL_PARTNER", is_active=True, profile__preferred_city__iexact=city)
    return [{"id": str(u.pk), "name": u.get_full_name() or u.email, "email": u.email} for u in users]


class FinalDocumentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(AgreementOrder, pk=order_id)
        if not can_access_agreement(request.user, order.agreement):
            self.permission_denied(request)
        if not order.final_document or (not request.user.is_staff and not order.get_customer_view()["is_ready_for_download"]):
            raise ValidationError("The final agreement is awaiting admin approval.")
        return FileResponse(order.final_document.open("rb"), as_attachment=True, filename=f"{order.order_number}.pdf")


class PrivateMediaView(APIView):
    """Session-authenticated Django admin links; JWT APIs use dedicated downloads."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, path):
        path = "agreements/" + path
        doc = AgreementDocument.objects.filter(file=path).first()
        if doc:
            if not can_access_agreement(request.user, doc.agreement, partner=True):
                self.permission_denied(request)
            return FileResponse(doc.file.open("rb"), as_attachment=True, filename=doc.file_name)
        order = AgreementOrder.objects.filter(final_document=path).first()
        if order:
            return FinalDocumentView.get(self, request, order.pk)
        from django.http import Http404
        raise Http404
