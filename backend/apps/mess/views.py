from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.mess.models import MessPlan, MessMenu, MealAttendance
from apps.mess.serializers import MessPlanSerializer, MessMenuSerializer, MealAttendanceSerializer

class MessPlanViewSet(viewsets.ModelViewSet):
    serializer_class = MessPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MessPlan.objects.filter(property__organization__members__user=user).distinct()

class MessMenuViewSet(viewsets.ModelViewSet):
    serializer_class = MessMenuSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        prop_id = self.request.query_params.get("property")
        if prop_id:
            return MessMenu.objects.filter(property_id=prop_id)
        return MessMenu.objects.all()

class MealAttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = MealAttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "TENANT":
            return MealAttendance.objects.filter(tenancy__tenant=user)
        return MealAttendance.objects.filter(tenancy__property__organization__members__user=user).distinct()

    @action(detail=False, methods=["post"])
    def toggle_opt_out(self, request):
        """Allows tenant to skip a meal to prevent food waste"""
        meal_date = request.data.get("meal_date")
        meal_type = request.data.get("meal_type")
        tenancy = request.user.tenancies.filter(status="ACTIVE").first()
        if not tenancy:
            return Response({"success": False, "message": "No active tenancy"}, status=status.HTTP_400_BAD_REQUEST)

        record, created = MealAttendance.objects.get_or_create(
            tenancy=tenancy,
            meal_date=meal_date,
            meal_type=meal_type,
            defaults={"is_opted_out": True}
        )
        if not created:
            record.is_opted_out = not record.is_opted_out
            record.save()

        return Response({
            "success": True,
            "is_opted_out": record.is_opted_out,
            "message": f"Meal {meal_type} on {meal_date} marked as {'Skipped / Opted-out' if record.is_opted_out else 'Attending'}."
        })
