from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'phone']
        
    def save(self, commit=True):
        user = super().save(commit=False)
        # Автоматически делаем email логином под капотом!
        user.username = user.email 
        if commit:
            user.save()
        return user

class CustomUserChangeForm(UserChangeForm):
    password = None # Убираем поле изменения пароля из обычного профиля
    
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'phone', 'address']