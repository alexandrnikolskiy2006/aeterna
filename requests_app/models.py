from django.db import models

class CustomerRequest(models.Model):
    REQUEST_TYPES = [
        ('testdrive', 'Тест-драйв'),
        ('consult', 'Консультация'),
        ('credit', 'Кредит'),
        ('tech', 'Техническое обслуживание'),
        ('tradein', 'Trade-in'),
    ]

    first_name = models.CharField(max_length=100, verbose_name='Имя')
    last_name = models.CharField(max_length=100, verbose_name='Фамилия')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    email = models.EmailField(verbose_name='Email')
    request_type = models.CharField(max_length=50, choices=REQUEST_TYPES, verbose_name='Тип заявки')
    message = models.TextField(blank=True, verbose_name='Сообщение')
    
    status = models.CharField(
        max_length=20, 
        choices=[('new', 'Новая'), ('in_progress', 'В обработке'), ('completed', 'Завершена')],
        default='new',
        verbose_name='Статус'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'

    def __str__(self):
        return f"Заявка от {self.first_name} {self.last_name} ({self.get_request_type_display()})"