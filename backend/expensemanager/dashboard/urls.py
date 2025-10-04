from django.urls import path
from .views import AdminDashboardStatsView, EmployeeDashboardStatsView, ManagerDashboardStatsView

urlpatterns = [
    path('admin/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('employee/', EmployeeDashboardStatsView.as_view(), name='employee-dashboard-stats'),
    path('manager/', ManagerDashboardStatsView.as_view(), name='manager-dashboard-stats'), # Add this line
]