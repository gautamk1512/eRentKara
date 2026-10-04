from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.kyc.views import KYCViewSet

router = DefaultRouter()
router.register(r"", KYCViewSet, basename="kyc")

urlpatterns = [
    path("", include(router.urls)),
]
