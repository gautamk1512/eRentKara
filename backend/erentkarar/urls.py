"""
URL configuration for erentkarar project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "service": "eRentKarar API",
        "version": "1.0.0",
        "database": "connected",
        "compliance": "India-First",
    })

def ready_check(request):
    return JsonResponse({"status": "ready"})

api_v1_patterns = [
    path("auth/", include("apps.accounts.urls")),
    path("organizations/", include("apps.organizations.urls")),
    path("properties/", include("apps.properties.urls")),
    path("marketplace/", include("apps.marketplace.urls")),
    path("tenants/", include("apps.tenants.urls")),
    path("leads/", include("apps.leads.urls")),
    path("bookings/", include("apps.bookings.urls")),
    path("kyc/", include("apps.kyc.urls")),
    path("agreements/", include("apps.agreements.urls")),
    path("invoices/", include("apps.billing.urls")),
    path("payments/", include("apps.payments.urls")),
    path("complaints/", include("apps.complaints.urls")),
    path("visitors/", include("apps.visitors.urls")),
    path("mess/", include("apps.mess.urls")),
    path("referrals/", include("apps.referrals.urls")),
    path("subscriptions/", include("apps.subscriptions.urls")),
    path("reports/", include("apps.reports.urls")),
    path("ai/", include("apps.ai.urls")),
    path("audit/", include("apps.audit.urls")),
    path("rent-agreements/", include("apps.agreements.urls")),
    path("verification/", include("apps.agreements.verification_urls")),
]

from apps.agreements.views import WebhookReceiverView

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("ready/", ready_check, name="ready-check"),
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
    path("api/rent-agreements/", include("apps.agreements.urls")),
    path("api/webhooks/<str:webhook_type>/", WebhookReceiverView.as_view(), name="root-webhooks"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
