import uuid
from django.db import models
from apps.properties.models import Property
from apps.tenants.models import Tenancy

class MessPlan(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="mess_plans")
    name = models.CharField(max_length=100, help_text="e.g. 3 Meals / Day (Veg + Non-Veg)")
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.property.title} - {self.name} (₹{self.monthly_price}/mo)"

class MessMenu(models.Model):
    class DayOfWeek(models.IntegerChoices):
        MONDAY = 1, "Monday"
        TUESDAY = 2, "Tuesday"
        WEDNESDAY = 3, "Wednesday"
        THURSDAY = 4, "Thursday"
        FRIDAY = 5, "Friday"
        SATURDAY = 6, "Saturday"
        SUNDAY = 7, "Sunday"

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="weekly_menu")
    day_of_week = models.IntegerField(choices=DayOfWeek.choices)
    breakfast = models.CharField(max_length=255, help_text="e.g. Idli Vada Sambar, Tea/Coffee")
    lunch = models.CharField(max_length=255, help_text="e.g. Rice, Dal Tadka, Paneer Butter Masala, Roti, Curd")
    dinner = models.CharField(max_length=255, help_text="e.g. Roti, Chicken Curry / Mixed Veg, Rice, Gulab Jamun")
    special_item = models.CharField(max_length=150, blank=True)

    class Meta:
        unique_together = ("property", "day_of_week")
        ordering = ["day_of_week"]

    def __str__(self):
        return f"{self.property.title} - {self.get_day_of_week_display()} Menu"

class MealAttendance(models.Model):
    class MealType(models.TextChoices):
        BREAKFAST = "BREAKFAST", "Breakfast"
        LUNCH = "LUNCH", "Lunch"
        DINNER = "DINNER", "Dinner"

    tenancy = models.ForeignKey(Tenancy, on_delete=models.CASCADE, related_name="meal_attendance")
    meal_date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MealType.choices)
    is_opted_out = models.BooleanField(default=False, help_text="Tenant opted out 3 hours before to avoid wastage")
    marked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("tenancy", "meal_date", "meal_type")

    def __str__(self):
        return f"{self.tenancy.tenant.email} - {self.meal_date} {self.meal_type} [{'Opted Out' if self.is_opted_out else 'Present'}]"
