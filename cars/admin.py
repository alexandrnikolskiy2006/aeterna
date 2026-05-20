from django.contrib import admin
from .models import Car, CarImage

# Позволяет загружать фото галереи прямо на странице редактирования машины
class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1 # Сколько пустых полей для фото показывать по умолчанию

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('title', 'model_name', 'price', 'is_available')
    list_filter = ('is_available',)
    search_fields = ('title', 'model_name')
    # Подключаем галерею
    inlines = [CarImageInline]