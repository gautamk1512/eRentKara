from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.visitors.views import VisitorViewSet

router = DefaultRouter()
router.register(r"", VisitorViewSet, basename="visitor")

urlpatterns = [
    path("", include(router.urls)),
]
