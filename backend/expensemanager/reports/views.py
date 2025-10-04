from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from expenses.models import Expense
from datetime import datetime

class ExpenseReportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        queryset = Expense.objects.all()
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        category = request.query_params.get('category')
        status_param = request.query_params.get('status')

        if start_date_str:
            queryset = queryset.filter(date__gte=datetime.strptime(start_date_str, '%Y-%m-%d').date())
        if end_date_str:
            queryset = queryset.filter(date__lte=datetime.strptime(end_date_str, '%Y-%m-%d').date())
        if category:
            queryset = queryset.filter(category__iexact=category)
        if status_param:
            queryset = queryset.filter(status__iexact=status_param)

        total_amount = queryset.aggregate(Sum('amount'))['amount__sum'] or 0
        total_expenses = queryset.count()
        by_category = queryset.values('category').annotate(count=Count('id'), total=Sum('amount')).order_by('-total')

        report_data = {
            'summary': {
                'total_amount': round(total_amount, 2),
                'total_expenses': total_expenses,
            },
            'by_category': list(by_category)
        }
        return Response(report_data)