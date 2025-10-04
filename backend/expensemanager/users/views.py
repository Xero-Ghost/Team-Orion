# users/views.py
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
# Make sure to import AdminUserSerializer
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    MyTokenObtainPairSerializer,
    AdminUserSerializer
)
from .models import CustomUser

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Login view that uses the custom serializer to return user data with the token.
    This provides the response structure needed by auth.js.
    """
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Endpoint for creating new users."""
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Endpoint for the logged-in user to view and update their profile."""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        # Returns the user associated with the request's token
        return self.request.user


# --- ADD THIS MISSING VIEWSET ---
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for admins to manage all users.
    Handles requests to /api/admin/users/
    """
    permission_classes = [IsAdminUser] # Only admins can access this
    queryset = CustomUser.objects.all().order_by('email')
    serializer_class = AdminUserSerializer