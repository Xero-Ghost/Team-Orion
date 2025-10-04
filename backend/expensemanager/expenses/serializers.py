from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    employeeName = serializers.CharField(read_only=True)
    department = serializers.CharField(read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id', 'date', 'amount', 'currency', 'category', 'description', 'status',
            'employeeName', 'department'
        ]