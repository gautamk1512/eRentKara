from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.bookings.models import Booking
from apps.bookings.serializers import BookingSerializer
from apps.properties.models import Bed, Property
from apps.tenants.models import Tenancy
from apps.accounts.models import User

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]  # Tenants can create bookings, owners manage them

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Booking.objects.none()
        if user.role == "SUPER_ADMIN":
            return Booking.objects.all().select_related("property", "room", "bed")
        elif user.role == "TENANT":
            return Booking.objects.filter(user=user).select_related("property", "room", "bed")
        return Booking.objects.filter(organization__members__user=user).distinct().select_related("property", "room", "bed")

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Double-Booking Protected Reservation Engine.
        Acquires row-level lock on the target Bed before reserving.
        """
        property_id = request.data.get("property")
        bed_id = request.data.get("bed")
        move_in_date = request.data.get("move_in_date")
        tenant_name = request.data.get("tenant_name")
        tenant_phone = request.data.get("tenant_phone")
        tenant_email = request.data.get("tenant_email")

        if not property_id or not move_in_date or not tenant_name or not tenant_phone:
            return Response(
                {"success": False, "error": {"code": "VALIDATION_ERROR", "message": "Missing required booking details."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        prop = Property.objects.get(id=property_id)

        target_bed = None
        target_room = None

        if bed_id:
            # Pessimistic database lock to prevent race conditions
            target_bed = Bed.objects.select_for_update().filter(id=bed_id).first()
            if not target_bed:
                return Response(
                    {"success": False, "error": {"code": "BED_NOT_FOUND", "message": "Selected bed does not exist."}},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if target_bed.status != Bed.BedStatus.AVAILABLE:
                return Response(
                    {"success": False, "error": {"code": "BED_UNAVAILABLE", "message": "This bed is already reserved or occupied. Please select another bed."}},
                    status=status.HTTP_409_CONFLICT,
                )

            # Mark reserved immediately
            target_bed.status = Bed.BedStatus.RESERVED
            target_bed.save()
            target_room = target_bed.room

        booking = Booking.objects.create(
            organization=prop.organization,
            property=prop,
            room=target_room,
            bed=target_bed,
            user=request.user if request.user.is_authenticated else None,
            tenant_name=tenant_name,
            tenant_phone=tenant_phone,
            tenant_email=tenant_email,
            move_in_date=move_in_date,
            token_amount=request.data.get("token_amount", 1000.0),
            monthly_rent=target_bed.rent_amount if target_bed else prop.monthly_rent_starting,
            security_deposit=target_bed.deposit_amount if target_bed else prop.security_deposit,
            status=Booking.BookingStatus.CONFIRMED,
        )

        return Response(
            {
                "success": True,
                "message": "Booking reservation confirmed! Inventory secured.",
                "data": BookingSerializer(booking).data,
            },
            status=status.HTTP_201_CREATED,
        )
