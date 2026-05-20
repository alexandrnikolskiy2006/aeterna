from django.contrib import admin
from .models import CustomerRequest

@admin.register(CustomerRequest)
class CustomerRequestAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'request_type', 'status', 'created_at')
    list_filter = ('status', 'request_type', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone', 'email')
    readonly_fields = ('created_at',)
    list_editable = ('status',) 