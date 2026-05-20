from django.http import JsonResponse
from .models import Car

def api_cars(request):
    cars = Car.objects.filter(is_available=True)
    cars_data = {}
    
    for car in cars:
        key = car.model_name.lower()
        
        # Получаем характеристики (specs)
        tech_specs = car.specs if isinstance(car.specs, list) else []
        
        # Получаем URL главной картинки (если она есть)
        main_image_url = car.main_image.url if car.main_image else ""
        
        # Собираем URL всех картинок из галереи
        gallery_images = [img.image.url for img in car.gallery.all()]
        
        # Собираем все картинки в один список для слайдера в модальном окне
        all_images = []
        if main_image_url:
            all_images.append(main_image_url)
        all_images.extend(gallery_images)
        
        cars_data[key] = {
            "name": car.title,
            "spec": f"Двигатель/Коробка: {car.spec}",
            "price": f"{car.price} ₽",
            "description": car.description,
            "tech": tech_specs,
            "images": all_images # Передаем список реальных URL файлов
        }
        
    return JsonResponse(cars_data)