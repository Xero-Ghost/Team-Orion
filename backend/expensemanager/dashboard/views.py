from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q, F
from expenses.models import Expense
from users.models import CustomUser

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({"error": "Permission denied"}, status=403)

        pending_reimbursement = Expense.objects.filter(status='Pending').aggregate(total=Sum('amount'))['total'] or 0
        month_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0 # Simplified to all-time for now

        stats = {
            "totalManagers": CustomUser.objects.filter(role='manager').count(),
            "totalEmployees": CustomUser.objects.filter(role='employee').count(),
            "pendingReimbursement": pending_reimbursement,
            "monthExpenses": month_expenses,
        }
        return Response(stats)

class EmployeeDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        my_expenses = Expense.objects.filter(employee=user)

        stats = {
            "totalSubmitted": my_expenses.aggregate(total=Sum('amount'))['total'] or 0,
            "pendingCount": my_expenses.filter(status='Pending').count(),
            "approvedAmount": my_expenses.filter(status='Approved').aggregate(total=Sum('amount'))['total'] or 0,
            "rejectedCount": my_expenses.filter(status='Rejected').count(),
            "recentExpenses": list(my_expenses.order_by('-date')[:5].values('id', 'date', 'amount', 'category', 'status'))
        }
        return Response(stats)
    
class ManagerDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if request.user.role not in ['manager', 'admin']:
            return Response({"error": "Permission denied"}, status=403)

        # For simplicity, a manager sees all employee expenses.
        # A real app would have a direct manager-to-employee relationship.
        team_expenses = Expense.objects.filter(employee__role='employee')
        team_members = CustomUser.objects.filter(role='employee')

        stats = {
            "pendingCount": team_expenses.filter(status='Pending').count(),
            "teamExpensesThisMonth": team_expenses.aggregate(total=Sum('amount'))['total'] or 0,
            "teamSize": team_members.count(),
            "teamMembers": list(team_members.values('id', 'first_name', 'email')),
            "pendingExpenses": list(team_expenses.filter(status='Pending').order_by('-date')[:5].values(
                'id', 'date', 'amount', 'category', 'status', 'description', employee_name=F('employee__first_name')
            ))
        }
        return Response(stats)