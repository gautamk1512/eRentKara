from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.payments.views import (
    PaymentViewSet,
    PaymentWebhookView,
    CreateRazorpayOrderView,
    VerifyRazorpayPaymentView,
)

router = DefaultRouter()
router.register(r"", PaymentViewSet, basename="payment")

urlpatterns = [
    path("create-order/", CreateRazorpayOrderView.as_view(), name="payment-create-order"),
    path("create-order", CreateRazorpayOrderView.as_view(), name="payment-create-order-no-slash"),
    path("verify-payment/", VerifyRazorpayPaymentView.as_view(), name="payment-verify-payment"),
    path("verify-payment", VerifyRazorpayPaymentView.as_view(), name="payment-verify-payment-no-slash"),
    path("webhook/", PaymentWebhookView.as_view(), name="payment-webhook"),
    path("", include(router.urls)),
]
