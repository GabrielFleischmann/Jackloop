from django.contrib import admin
from .models import Transaction, DailyCoin


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'amount', 'transaction_type', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['user__name', 'user__email', 'description']
    readonly_fields = ['created_at']
    ordering = ['-created_at']


@admin.register(DailyCoin)
class DailyCoinAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'streak', 'last_claim', 'daily_amount']
    search_fields = ['user__name', 'user__email']
    readonly_fields = ['last_claim']
    ordering = ['-streak']
