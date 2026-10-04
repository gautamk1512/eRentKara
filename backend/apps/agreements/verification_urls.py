from django.urls import path
from apps.agreements.verification_views import (
    AadhaarVerificationStartView,
    AadhaarVerificationVerifyOtpView,
    AadhaarVerificationResendOtpView,
    AadhaarVerificationStatusView,
    StandaloneMobileVerifyView,
)

urlpatterns = [
    path("aadhaar/start/", AadhaarVerificationStartView.as_view(), name="aadhaar-start"),
    path("aadhaar/verify-otp/", AadhaarVerificationVerifyOtpView.as_view(), name="aadhaar-verify-otp"),
    path("aadhaar/resend-otp/", AadhaarVerificationResendOtpView.as_view(), name="aadhaar-resend-otp"),
    path("status/<str:reference>/", AadhaarVerificationStatusView.as_view(), name="verification-status"),
    path("mobile/", StandaloneMobileVerifyView.as_view(), name="standalone-mobile-verify"),
]
