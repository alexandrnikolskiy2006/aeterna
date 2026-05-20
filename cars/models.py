from django.db import models

class Car(models.Model):
    title = models.CharField(max_length=100)
    model_name = models.CharField(max_length=50, unique=True, help_text="Уникальный ключ для JS (например: celeste)")
    spec = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    specs = models.JSONField(default=dict, help_text='Формат: [["Мощность", "420 л.с."], ["Скорость", "285"]]')
    
    # Главная картинка (Превью для карусели)
    main_image = models.ImageField(upload_to='cars/main/', blank=True, null=True, verbose_name="Главное фото")
    
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title}"

# Новая модель для галереи (Модального окна)
class CarImage(models.Model):
    car = models.ForeignKey(Car, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='cars/gallery/')
    
    def __str__(self):
        return f"Фото для {self.car.title}"