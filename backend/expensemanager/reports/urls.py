from django.urls import path
from .views import ExpenseReportView

urlpatterns = [
    path('expenses/', ExpenseReportView.as_view(), name='expense-report'),
]