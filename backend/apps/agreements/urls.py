from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.agreements.views import (
    AgreementViewSet,
    DutyCalculatorView,
    StateRulesView,
    AgreementClauseListView,
    InvitationResolveView,
    PublicDocumentVerificationView,
    ShopViewSet,
    KioskSessionViewSet,
    WebhookReceiverView,
    PricingConfigView,
    DocumentUploadView,
    DocumentListView,
    AgreementOrderViewSet,
    AdminAgreementOrderViewSet,
)

from .fulfilment import PartnerOrderViewSet, DocumentDownloadViewSet, FinalDocumentView

router = DefaultRouter()
router.register(r"partner-orders", PartnerOrderViewSet, basename="partner-order")
router.register(r"document-downloads", DocumentDownloadViewSet, basename="document-download")
router.register(r"orders", AgreementOrderViewSet, basename="agreement-order")
router.register(r"admin-orders", AdminAgreementOrderViewSet, basename="admin-agreement-order")
router.register(r"shops", ShopViewSet, basename="shop")
router.register(r"kiosk-sessions", KioskSessionViewSet, basename="kiosk-session")
router.register(r"", AgreementViewSet, basename="agreement")

urlpatterns = [
    path("orders/<uuid:order_id>/download/", FinalDocumentView.as_view(), name="final-order-download"),
    path("pricing-config/", PricingConfigView.as_view(), name="pricing-config"),
    path("<uuid:agreement_id>/upload-document/", DocumentUploadView.as_view(), name="upload-document"),
    path("<uuid:agreement_id>/documents/", DocumentListView.as_view(), name="list-documents"),
    path("calculate-duty/", DutyCalculatorView.as_view(), name="calculate-duty"),
    path("state-rules/", StateRulesView.as_view(), name="state-rules"),
    path("clauses/", AgreementClauseListView.as_view(), name="agreement-clauses"),
    path("invitations/<str:token>/", InvitationResolveView.as_view(), name="invitation-resolve"),
    path("verify/<str:token>/", PublicDocumentVerificationView.as_view(), name="public-verify"),
    path("webhooks/<str:webhook_type>/", WebhookReceiverView.as_view(), name="webhooks"),
    path("", include(router.urls)),
]
