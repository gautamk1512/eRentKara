from django.urls import path
from apps.marketplace.views import (
    MarketplaceSearchView,
    MarketplaceDetailView,
    PublicEnquiryView,
    CityListView,
    MarketplaceStatsView,
    PublicPropertyListCreateView,
)

urlpatterns = [
    path("search/", MarketplaceSearchView.as_view(), name="marketplace-search"),
    path("property/<slug:slug>/", MarketplaceDetailView.as_view(), name="marketplace-detail"),
    path("enquire/", PublicEnquiryView.as_view(), name="marketplace-enquire"),
    path("cities/", CityListView.as_view(), name="marketplace-cities"),
    path("stats/", MarketplaceStatsView.as_view(), name="marketplace-stats"),
    path("list-property/", PublicPropertyListCreateView.as_view(), name="marketplace-list-property"),
]
