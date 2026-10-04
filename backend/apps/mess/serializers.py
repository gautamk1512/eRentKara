from rest_framework import serializers
from apps.mess.models import MessPlan, MessMenu, MealAttendance

class MessPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessPlan
        fields = "__all__"

class MessMenuSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source="get_day_of_week_display", read_only=True)

    class Meta:
        model = MessMenu
        fields = ["id", "property", "day_of_week", "day_name", "breakfast", "lunch", "dinner", "special_item"]

class MealAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealAttendance
        fields = "__all__"
