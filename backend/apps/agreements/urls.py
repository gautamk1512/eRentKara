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
)

router = DefaultRouter()
router.register(r"shops", ShopViewSet, basename="shop")
router.register(r"kiosk-sessions", KioskSessionViewSet, basename="kiosk-session")
router.register(r"", AgreementViewSet, basename="agreement")

urlpatterns = [
    path("calculate-duty/", DutyCalculatorView.as_view(), name="calculate-duty"),
    path("state-rules/", StateRulesView.as_view(), name="state-rules"),
    path("clauses/", AgreementClauseListView.as_view(), name="agreement-clauses"),
    path("invitations/<str:token>/", InvitationResolveView.as_view(), name="invitation-resolve"),
    path("verify/<str:token>/", PublicDocumentVerificationView.as_view(), name="public-verify"),
    path("webhooks/<str:webhook_type>/", WebhookReceiverView.as_view(), name="webhooks"),
    path("", include(router.urls)),
]
