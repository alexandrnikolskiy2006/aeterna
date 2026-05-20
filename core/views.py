from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.contrib import messages
from requests_app.models import CustomerRequest
from .forms import CustomUserChangeForm

from .forms import CustomUserCreationForm
from cars.models import Car

def home(request):
    # Get all available cars to pass to the index page
    cars = Car.objects.filter(is_available=True)
    return render(request, 'index.html', {'cars': cars})

@csrf_protect
def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': True})
            messages.success(request, "🎉 Регистрация прошла успешно! Добро пожаловать!")
            return redirect('profile')
        else:
            errors = []
            for field, field_errors in form.errors.items():
                for error in field_errors:
                    errors.append(f"{field}: {error}")

            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': errors})
            else:
                for field, field_errors in form.errors.items():
                    for error in field_errors:
                        messages.error(request, f"{field}: {error}")
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

@csrf_protect
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': True})
            messages.success(request, "✅ Вы успешно вошли в аккаунт!")
            return redirect('profile')
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': ['Неверное имя пользователя или пароль']})
            messages.error(request, "❌ Неверное имя пользователя или пароль")

    return render(request, 'index.html')

@login_required
def profile_view(request):
    if request.method == 'POST':
        # Принимаем данные, если пользователь нажал "Сохранить"
        form = CustomUserChangeForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'errors': form.errors})
        
    return render(request, 'profile.html')

def logout_view(request):
    logout(request)
    messages.info(request, "👋 Вы вышли из аккаунта")
    return redirect('home')

def request_view(request):
    if request.method == 'POST':
        CustomerRequest.objects.create(
            first_name=request.POST.get('first_name', ''),
            last_name=request.POST.get('last_name', ''),
            phone=request.POST.get('phone', ''),
            email=request.POST.get('email', ''),
            request_type=request.POST.get('request_type', ''),
            message=request.POST.get('message', '')
        )
        messages.success(request, "✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.")
        return redirect('home')

    return render(request, 'request.html')
