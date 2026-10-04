from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.billing.views import InvoiceViewSet, ElectricityReadingViewSet

router = DefaultRouter()
router.register(r"electricity", ElectricityReadingViewSet, basename="electricity")
router.register(r"", InvoiceViewSet, basename="invoice")

urlpatterns = [
    path("", include(router.urls)),
]
