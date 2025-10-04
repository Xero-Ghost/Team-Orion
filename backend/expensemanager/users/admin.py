# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Admin View for CustomUser
    """
    model = CustomUser
    
    # Fields to display in the user list
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff')
    
    # Fields to use for searching
    search_fields = ('email', 'first_name', 'last_name')
    
    # Set the ordering to a field that exists, like 'email'
    ordering = ('email',)
    
    # Remove 'username' from the fieldsets
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'role')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Fields for creating a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name', 'role'),
        }),
    )