from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from django.contrib.auth.models import Group
class CustomUserAdmin(UserAdmin):
    # Поля, которые будут отображаться в списке пользователей
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone', 'is_staff')
    
    # Поля, по которым можно искать пользователя
    search_fields = ('username', 'email', 'phone', 'first_name', 'last_name')
    
    # Добавляем наши кастомные поля (phone, address) в карточку редактирования пользователя
    fieldsets = UserAdmin.fieldsets + (
        ('Дополнительная информация', {'fields': ('phone', 'address')}),
    )
    
    # Добавляем кастомные поля на форму создания пользователя через саму админку (если понадобится)
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Дополнительная информация', {'fields': ('phone', 'address')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.unregister(Group)

