from django.contrib import admin
from apps.staff.models import Staff


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ("user", "designation", "organization", "monthly_salary", "shift_timings", "is_active", "joined_date")
    list_filter = ("designation", "is_active", "organization")
    search_fields = ("user__email", "user__first_name", "user__last_name", "designation", "organization__name")
    filter_horizontal = ("assigned_properties",)
