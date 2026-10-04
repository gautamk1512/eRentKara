from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.tenants.views import TenancyViewSet

router = DefaultRouter()
router.register(r"", TenancyViewSet, basename="tenancy")

urlpatterns = [
    path("", include(router.urls)),
]
