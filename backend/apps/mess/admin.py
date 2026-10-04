from django.contrib import admin
from apps.mess.models import MessPlan, MessMenu, MealAttendance


@admin.register(MessPlan)
class MessPlanAdmin(admin.ModelAdmin):
    list_display = ("name", "property", "monthly_price", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "property__title")


@admin.register(MessMenu)
class MessMenuAdmin(admin.ModelAdmin):
    list_display = ("property", "day_of_week", "breakfast", "lunch", "dinner", "special_item")
    list_filter = ("day_of_week",)
    search_fields = ("property__title", "breakfast", "lunch", "dinner")


@admin.register(MealAttendance)
class MealAttendanceAdmin(admin.ModelAdmin):
    list_display = ("tenancy", "meal_date", "meal_type", "is_opted_out", "marked_at")
    list_filter = ("meal_type", "is_opted_out", "meal_date")
    search_fields = ("tenancy__tenant__email", "tenancy__property__title")
