from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('', include('cars.urls')),
]

# ==================== СТАТИКА ====================
if settings.DEBUG:
    # Основное обслуживание из staticfiles
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Прямое обслуживание (самое надёжное)
    urlpatterns += [
        path('static/css/<path:path>', serve, {'document_root': settings.BASE_DIR / 'css'}),
        path('static/js/<path:path>', serve, {'document_root': settings.BASE_DIR / 'js'}),
        path('static/images/<path:path>', serve, {'document_root': settings.BASE_DIR / 'images'}),
        path('static/fonts/<path:path>', serve, {'document_root': settings.BASE_DIR / 'fonts'}),
        
        # Дополнительно — без /static/ (на всякий случай)
        path('css/<path:path>', serve, {'document_root': settings.BASE_DIR / 'css'}),
        path('js/<path:path>', serve, {'document_root': settings.BASE_DIR / 'js'}),
        path('images/<path:path>', serve, {'document_root': settings.BASE_DIR / 'images'}),
    ]