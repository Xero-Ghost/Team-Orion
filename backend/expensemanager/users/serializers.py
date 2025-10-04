# users/serializers.py
from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    """Serializer for displaying user data."""
    # The frontend expects 'name', so we map it from 'first_name'
    name = serializers.CharField(source='first_name', read_only=True)

    class Meta:
        model = CustomUser
        # Fields to be returned in the API response
        fields = ['id', 'email', 'first_name', 'last_name', 'name', 'role']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer to include user data in the login response.
    This matches the expectation in auth.js.
    """
    def validate(self, attrs):
        # The parent's `validate` method handles the authentication
        data = super().validate(attrs)
        
        # Add the serialized user data to the response
        serializer = UserSerializer(self.user)
        data['user'] = serializer.data
        
        return data


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        # Use the custom manager's create_user method to handle password hashing
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'employee')
        )
        return user

class AdminUserSerializer(serializers.ModelSerializer):
    """
    Serializer for admins to manage users.
    Allows viewing and editing of more fields, including 'role'.
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff']