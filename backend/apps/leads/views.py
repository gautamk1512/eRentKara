from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.leads.models import Lead, LeadActivity, Visit
from apps.leads.serializers import LeadSerializer, LeadActivitySerializer, VisitSerializer

class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Lead.objects.filter(organization__members__user=user).distinct().prefetch_related("activities", "visits")

    @action(detail=True, methods=["post"])
    def add_activity(self, request, pk=None):
        lead = self.get_object()
        activity_type = request.data.get("activity_type", LeadActivity.ActivityType.NOTE)
        note = request.data.get("note", "")

        activity = LeadActivity.objects.create(
            lead=lead,
            user=request.user,
            activity_type=activity_type,
            note=note,
        )
        return Response({"success": True, "data": LeadActivitySerializer(activity).data})

    @action(detail=True, methods=["post"])
    def schedule_visit(self, request, pk=None):
        lead = self.get_object()
        scheduled_at = request.data.get("scheduled_at")
        property_id = request.data.get("property_id") or (lead.property.id if lead.property else None)

        if not scheduled_at or not property_id:
            return Response(
                {"success": False, "error": {"code": "VALIDATION_ERROR", "message": "scheduled_at and property_id are required."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        visit = Visit.objects.create(
            lead=lead,
            property_id=property_id,
            scheduled_at=scheduled_at,
            assigned_staff=request.user,
        )
        lead.status = Lead.LeadStatus.VISIT_SCHEDULED
        lead.save()

        return Response({"success": True, "data": VisitSerializer(visit).data})

class VisitViewSet(viewsets.ModelViewSet):
    serializer_class = VisitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Visit.objects.filter(property__organization__members__user=user).distinct()
