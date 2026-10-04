from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from apps.visitors.models import Visitor
from apps.visitors.serializers import VisitorSerializer
from apps.tenants.models import Tenancy

class VisitorViewSet(viewsets.ModelViewSet):
    serializer_class = VisitorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "SUPER_ADMIN":
            return Visitor.objects.all().select_related("tenancy__tenant")
        elif user.role == "TENANT":
            return Visitor.objects.filter(tenancy__tenant=user).select_related("tenancy__tenant")
        return Visitor.objects.filter(tenancy__property__organization__members__user=user).distinct().select_related("tenancy__tenant")

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == "TENANT":
            tenancy = Tenancy.objects.filter(tenant=user, status=Tenancy.TenancyStatus.ACTIVE).first()
            if tenancy:
                serializer.save(tenancy=tenancy, status=Visitor.VisitorStatus.APPROVED)
                return
        serializer.save()

    @action(detail=True, methods=["post"])
    def check_in(self, request, pk=None):
        v = self.get_object()
        v.status = Visitor.VisitorStatus.CHECKED_IN
        v.check_in_time = timezone.now()
        v.security_guard = request.user
        v.save()
        return Response({"success": True, "message": f"{v.visitor_name} checked in at {v.check_in_time}."})

    @action(detail=True, methods=["post"])
    def check_out(self, request, pk=None):
        v = self.get_object()
        v.status = Visitor.VisitorStatus.CHECKED_OUT
        v.check_out_time = timezone.now()
        v.save()
        return Response({"success": True, "message": f"{v.visitor_name} checked out at {v.check_out_time}."})
