from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from apps.organizations.models import Organization, OrganizationMember
from apps.organizations.serializers import OrganizationSerializer, OrganizationMemberSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Multi-tenant scoping: Users only see organizations where they are members
        if self.request.user.role == "SUPER_ADMIN":
            return Organization.objects.all()
        return Organization.objects.filter(members__user=self.request.user, members__is_active=True)

    def perform_create(self, serializer):
        org = serializer.save()
        OrganizationMember.objects.create(
            organization=org,
            user=self.request.user,
            role=OrganizationMember.MemberRole.OWNER,
        )
