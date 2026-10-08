from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.tenants.models import Tenancy, MoveIn, MoveOut
from apps.tenants.serializers import TenancySerializer, MoveInSerializer, MoveOutSerializer
from apps.properties.models import Property, Room, Bed
from apps.accounts.models import User
from apps.access import can_manage_organization
from django.db import transaction
from rest_framework import serializers

class TenancyViewSet(viewsets.ModelViewSet):
    serializer_class = TenancySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "SUPER_ADMIN":
            return Tenancy.objects.all().select_related("tenant", "property", "room", "bed")
        elif user.role == "TENANT":
            return Tenancy.objects.filter(tenant=user).select_related("tenant", "property", "room", "bed")
        else:
            # Owner / Staff
            return Tenancy.objects.filter(
                property__organization__members__user=user
            ).distinct().select_related("tenant", "property", "room", "bed")

    @action(detail=False, methods=["get"])
    def my_stay(self, request):
        """Current active stay for tenant portal"""
        tenancy = Tenancy.objects.filter(tenant=request.user, status=Tenancy.TenancyStatus.ACTIVE).first()
        if not tenancy:
            # Check for pending stay
            tenancy = Tenancy.objects.filter(tenant=request.user).first()
        if not tenancy:
            return Response({"success": False, "message": "No active tenancy found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": True, "data": TenancySerializer(tenancy).data})

    @action(detail=True, methods=["post"])
    def onboard(self, request, pk=None):
        """Move tenant in and mark Bed OCCUPIED"""
        tenancy = self.get_object()
        if not can_manage_organization(request.user, tenancy.property.organization):
            return Response({'error': 'Only the property operator can onboard tenants.'}, status=403)
        tenancy.status = Tenancy.TenancyStatus.ACTIVE
        tenancy.save()
        if tenancy.bed:
            tenancy.bed.status = Bed.BedStatus.OCCUPIED
            tenancy.bed.save()
        MoveIn.objects.get_or_create(
            tenancy=tenancy,
            defaults={"actual_move_in_date": tenancy.start_date, "keys_handed_over": True}
        )
        return Response({"success": True, "message": f"Tenant {tenancy.tenant.email} onboarded successfully."})

    @action(detail=False, methods=["post"])
    @transaction.atomic
    def enroll(self, request):
        """
        Directly enroll / admit a student or tenant into a PG property/room/bed.
        Handles creating or fetching user, setting role TENANT, allocating bed,
        marking bed OCCUPIED, creating Tenancy, and creating MoveIn record.
        """
        property_id = request.data.get("property")
        bed_id = request.data.get("bed")
        room_id = request.data.get("room")
        tenant_name = request.data.get("tenant_name", "").strip()
        tenant_email = request.data.get("tenant_email", "").strip().lower()
        tenant_phone = request.data.get("tenant_phone", "").strip()
        start_date = request.data.get("start_date")
        monthly_rent = request.data.get("monthly_rent")
        security_deposit_paid = request.data.get("security_deposit_paid", 0.0)

        if not property_id or not tenant_email or not start_date:
            return Response(
                {"success": False, "error": {"message": "Property, tenant email, and start date are required."}},
                status=status.HTTP_400_BAD_REQUEST
            )

        prop = Property.objects.filter(id=property_id).first()
        if not prop:
            return Response({"success": False, "error": {"message": "Property not found."}}, status=status.HTTP_404_NOT_FOUND)

        if not can_manage_organization(request.user, prop.organization):
            return Response({'error': 'You cannot enroll tenants in this property.'}, status=403)
        start_date = serializers.DateField().run_validation(start_date)
        tenant_email = serializers.EmailField().run_validation(tenant_email).lower()
        monthly_rent = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0).run_validation(monthly_rent or 0)
        security_deposit_paid = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0).run_validation(security_deposit_paid)
        target_bed = None
        target_room = None
        if bed_id:
            target_bed = Bed.objects.select_for_update().filter(id=bed_id, room__floor__building__property=prop).first()
            if not target_bed:
                return Response({'error': 'Bed does not belong to this property.'}, status=400)
            if target_bed.status != Bed.BedStatus.AVAILABLE:
                return Response({'error': 'Bed is reserved or occupied.'}, status=409)
            target_room = target_bed.room
        elif room_id:
            target_room = Room.objects.filter(id=room_id, floor__building__property=prop).first()
            if not target_room:
                return Response({'error': 'Room does not belong to this property.'}, status=400)

        names = tenant_name.split(" ", 1)
        first_name = names[0] if names else "Student"
        last_name = names[1] if len(names) > 1 else "Tenant"

        tenant_user = User.objects.filter(email=tenant_email).first()
        if not tenant_user:
            tenant_user = User.objects.create(
                email=tenant_email,
                phone_number=tenant_phone or None,
                first_name=first_name,
                last_name=last_name,
                role=User.RoleChoices.TENANT
            )
            tenant_user.set_unusable_password()
            tenant_user.save()
        else:
            if tenant_user.role != User.RoleChoices.TENANT:
                return Response({'error': 'This email belongs to an operator account.'}, status=400)
            if tenant_phone and not tenant_user.phone_number:
                tenant_user.phone_number = tenant_phone
            if tenant_name:
                tenant_user.first_name = first_name
                tenant_user.last_name = last_name
            tenant_user.save()

        if target_bed:
            target_bed.status = Bed.BedStatus.OCCUPIED
            target_bed.save()

        rent = monthly_rent or (target_bed.rent_amount if target_bed else prop.monthly_rent_starting)

        tenancy = Tenancy.objects.create(
            tenant=tenant_user,
            property=prop,
            room=target_room,
            bed=target_bed,
            start_date=start_date,
            monthly_rent=rent,
            security_deposit_paid=security_deposit_paid or 0.0,
            status=Tenancy.TenancyStatus.ACTIVE,
        )

        MoveIn.objects.get_or_create(
            tenancy=tenancy,
            defaults={"actual_move_in_date": start_date, "keys_handed_over": True}
        )

        return Response(
            {
                "success": True,
                "message": f"Student / Tenant {tenant_user.first_name or tenant_user.email} enrolled successfully in {prop.title}!",
                "data": TenancySerializer(tenancy).data
            },
            status=status.HTTP_201_CREATED
        )
