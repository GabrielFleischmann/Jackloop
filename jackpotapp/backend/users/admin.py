from django.contrib import admin
from .models import Users


@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('id', 'email')
    search_fields = ('email',)
    readonly_fields = ('id',)
