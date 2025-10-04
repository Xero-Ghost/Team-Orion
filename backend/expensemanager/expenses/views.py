from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Expense
from .serializers import ExpenseSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'manager':
            # Managers see all 'employee' role expenses plus their own
            return Expense.objects.filter(employee__role__in=['employee', 'manager'])
        if user.role == 'admin':
            return Expense.objects.all()
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
            return Response({'error': 'Invalid status value.'}, status=status.HTTP_400_BAD_REQUEST)

        expense.status = new_status
        expense.save()
        return Response({'success': True, 'message': f'Expense status updated to {new_status}'})

class CountryListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        countries = [
            { "name": "United States", "code": "US", "currency": "USD" },
            { "name": "United Kingdom", "code": "GB", "currency": "GBP" },
            { "name": "India", "code": "IN", "currency": "INR" },
        ]
        return Response(countries)