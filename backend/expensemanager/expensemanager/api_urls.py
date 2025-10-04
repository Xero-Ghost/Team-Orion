from django.urls import path, include

urlpatterns = [
    path('', include('users.urls')),
    path('', include('expenses.urls')),
    path('reports/', include('reports.urls')),
]