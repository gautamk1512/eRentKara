from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.mess.views import MessPlanViewSet, MessMenuViewSet, MealAttendanceViewSet

router = DefaultRouter()
router.register(r"plans", MessPlanViewSet, basename="mess-plan")
router.register(r"menu", MessMenuViewSet, basename="mess-menu")
router.register(r"attendance", MealAttendanceViewSet, basename="meal-attendance")

urlpatterns = [
    path("", include(router.urls)),
]
