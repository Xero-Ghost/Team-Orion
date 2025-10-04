from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Expense, ApprovalRule
from .serializers import ExpenseSerializer, ApprovalRuleSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            # For 'team-expenses.js', a manager sees all employee expenses
            return Expense.objects.filter(employee__role='employee')
        return Expense.objects.filter(employee=user)

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        expense = self.get_object()
        user = request.user
        new_status = request.data.get('status')

        if user.role not in ['admin', 'manager']:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        if new_status not in ['Approved', 'Rejected']:
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        expense.status = new_status
        expense.save()
        return Response({'success': True, 'message': f'Expense has been {new_status}'})


class ApprovalRuleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = ApprovalRule.objects.all()
    serializer_class = ApprovalRuleSerializer

class CountryListView(APIView):
    """
    Provides a list of countries and their currency codes.
    This endpoint is public and does not require authentication.
    """
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        """
        Returns a hardcoded list of countries.
        """
        countries = [
            { "name": "United States", "code": "US", "currency": "USD" },
            { "name": "United Kingdom", "code": "GB", "currency": "GBP" },
            { "name": "India", "code": "IN", "currency": "INR" },
            { "name": "Germany", "code": "DE", "currency": "EUR" },
            { "name": "Japan", "code": "JP", "currency": "JPY" },
        ]
        return Response(countries)