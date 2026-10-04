from django.urls import path
from apps.ai.views import AIChatView, AIActionConfirmView

urlpatterns = [
    path("chat/", AIChatView.as_view(), name="ai-chat"),
    path("action/<uuid:action_id>/confirm/", AIActionConfirmView.as_view(), name="ai-action-confirm"),
]
