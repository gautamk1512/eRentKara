from rest_framework import viewsets, permissions, serializers
from apps.audit.models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = AuditLog
        fields = ["id", "user_email", "action", "entity_name", "entity_id", "details", "ip_address", "timestamp"]

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "SUPER_ADMIN":
            return AuditLog.objects.all()
        return AuditLog.objects.filter(organization__members__user=user).distinct()
