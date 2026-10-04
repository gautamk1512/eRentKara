from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.properties.views import (
    PropertyViewSet, BuildingViewSet, FloorViewSet, RoomViewSet, BedViewSet,
    PropertyAmenityViewSet, PropertyImageViewSet
)

router = DefaultRouter()
router.register(r"amenities", PropertyAmenityViewSet, basename="property-amenity")
router.register(r"images", PropertyImageViewSet, basename="property-image")
router.register(r"buildings", BuildingViewSet, basename="building")
router.register(r"floors", FloorViewSet, basename="floor")
router.register(r"rooms", RoomViewSet, basename="room")
router.register(r"beds", BedViewSet, basename="bed")
router.register(r"", PropertyViewSet, basename="property")

urlpatterns = [
    path("", include(router.urls)),
]
