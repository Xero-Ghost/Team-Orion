# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserProfileView,
    # We need the UserViewSet for the admin router
    UserViewSet
)

# --- Admin Router ---
# This router is specifically for your admin endpoints
admin_router = DefaultRouter()
admin_router.register(r'users', UserViewSet, basename='admin-user')

# --- Main URL Patterns ---
urlpatterns = [
    # Auth endpoints
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Profile endpoint
    path('users/me/', UserProfileView.as_view(), name='user_profile'),

    # Admin endpoints - All URLs here will be prefixed with /api/admin/
    path('admin/', include(admin_router.urls)),
]