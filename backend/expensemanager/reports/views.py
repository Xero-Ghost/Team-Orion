from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from expenses.models import Expense
from datetime import datetime

class ExpenseReportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        queryset = Expense.objects.all()

        # Apply filters from reports.js
        start_date = request.query_params.get('dateFrom')
        end_date = request.query_params.get('dateTo')
        status = request.query_params.get('status')
        # 'department' filter would require adding a department field to the User model

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if status:
            queryset = queryset.filter(status__iexact=status)

        # Generate data for charts
        trend_data = queryset.annotate(month=TruncMonth('date')).values('month').annotate(total=Sum('amount')).order_by('month')
        department_data = queryset.values('employee__first_name').annotate(total=Sum('amount')).order_by('-total') # Simplified to employee for now

        report = {
            "trend": {
                "labels": [t['month'].strftime('%b %Y') for t in trend_data],
                "data": [t['total'] for t in trend_data],
            },
            "department": {
                "labels": [d['employee__first_name'] for d in department_data],
                "data": [d['total'] for d in department_data],
            }
        }
        return Response(report)