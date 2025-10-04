from rest_framework import serializers
from .models import Expense, ApprovalRule

class ExpenseSerializer(serializers.ModelSerializer):
    employeeName = serializers.CharField(source='employee.first_name', read_only=True)
    class Meta:
        model = Expense
        fields = [
            'id', 'date', 'amount', 'currency', 'category', 'description', 
            'status', 'employeeName', 'receipt'
        ]

class ApprovalRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalRule
        fields = ['id', 'name', 'description']