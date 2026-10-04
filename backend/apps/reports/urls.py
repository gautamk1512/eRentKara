from django.urls import path
from apps.reports.views import DashboardMetricsView

urlpatterns = [
    path("dashboard-metrics/", DashboardMetricsView.as_view(), name="reports-dashboard-metrics"),
]
