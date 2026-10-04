from django.urls import path
from apps.referrals.views import MyReferralView, TrackReferralClickView

urlpatterns = [
    path("my-code/", MyReferralView.as_view(), name="my-referral"),
    path("track-click/", TrackReferralClickView.as_view(), name="track-referral-click"),
]
