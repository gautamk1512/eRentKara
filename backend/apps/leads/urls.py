from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.leads.views import LeadViewSet, VisitViewSet

router = DefaultRouter()
router.register(r"visits", VisitViewSet, basename="visit")
router.register(r"", LeadViewSet, basename="lead")

urlpatterns = [
    path("", include(router.urls)),
]
