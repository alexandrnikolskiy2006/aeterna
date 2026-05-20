from django.urls import path
from . import views

urlpatterns = [
    # Маршрут для получения данных о машинах
    path('api/cars/', views.api_cars, name='api_cars'),
]