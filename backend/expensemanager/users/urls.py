# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserProfileView,
    UserViewSet
)

admin_router = DefaultRouter()
admin_router.register(r'users', UserViewSet, basename='admin-user')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/me/', UserProfileView.as_view(), name='user_profile'),
    path('admin/', include(admin_router.urls)),
]