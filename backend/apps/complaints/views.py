from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.complaints.models import Complaint, MaintenanceTicket
from apps.complaints.serializers import ComplaintSerializer
from apps.tenants.models import Tenancy

class ComplaintViewSet(viewsets.ModelViewSet):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "SUPER_ADMIN":
            return Complaint.objects.all().select_related("property", "tenancy__tenant")
        elif user.role == "TENANT":
            return Complaint.objects.filter(tenancy__tenant=user).select_related("property", "tenancy__tenant")
        return Complaint.objects.filter(organization__members__user=user).distinct().select_related("property", "tenancy__tenant")

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == "TENANT":
            tenancy = Tenancy.objects.filter(tenant=user, status=Tenancy.TenancyStatus.ACTIVE).first()
            if not tenancy:
                tenancy = Tenancy.objects.filter(tenant=user).first()
            if tenancy:
                serializer.save(
                    organization=tenancy.property.organization,
                    property=tenancy.property,
                    tenancy=tenancy,
                )
                return
        serializer.save()

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        complaint = self.get_object()
        new_status = request.data.get("status")
        notes = request.data.get("notes", "")

        if new_status in Complaint.ComplaintStatus.values:
            complaint.status = new_status
            if notes:
                complaint.resolution_notes = notes
            if new_status == Complaint.ComplaintStatus.RESOLVED:
                complaint.resolved_at = timezone.now()
            complaint.save()
            return Response({"success": True, "status": complaint.status, "message": f"Complaint status updated to {complaint.get_status_display()}."})

        return Response({"success": False, "error": {"code": "INVALID_STATUS", "message": "Invalid complaint status."}}, status=status.HTTP_400_BAD_REQUEST)
