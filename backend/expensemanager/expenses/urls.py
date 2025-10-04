from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, CountryListView

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('countries/', CountryListView.as_view(), name='country-list'),
    path('', include(router.urls)),
]