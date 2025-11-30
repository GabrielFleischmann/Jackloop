from django.db import models
from users.models import User
from django.utils import timezone


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('daily_reward', 'Recompensa Diária'),
        ('purchase', 'Compra'),
        ('win', 'Ganho'),
        ('bonus', 'Bônus'),
        ('refund', 'Reembolso'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', verbose_name='Usuário')
    amount = models.IntegerField(verbose_name='Quantidade')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, verbose_name='Tipo')
    description = models.TextField(verbose_name='Descrição')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')
    
    class Meta:
        verbose_name = 'Transação'
        verbose_name_plural = 'Transações'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.user.name} - {self.amount} moedas ({self.transaction_type})'


class DailyCoin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='daily_coin', verbose_name='Usuário')
    last_claim = models.DateTimeField(null=True, blank=True, verbose_name='Última Coleta')
    streak = models.PositiveIntegerField(default=0, verbose_name='Sequência de Dias')
    daily_amount = models.PositiveIntegerField(default=100, verbose_name='Quantidade Diária')
    
    class Meta:
        verbose_name = 'Moeda Diária'
        verbose_name_plural = 'Moedas Diárias'
    
    def __str__(self):
        return f'{self.user.name} - Streak: {self.streak} dias'
    
    def can_claim(self):
        if not self.last_claim:
            return True
        now = timezone.now()
        time_diff = now - self.last_claim
        return time_diff.total_seconds() >= 86400
    
    def claim(self):
        if not self.can_claim():
            return None
        
        now = timezone.now()
        
        if self.last_claim:
            time_diff = now - self.last_claim
            if time_diff.total_seconds() < 172800:
                self.streak += 1
            else:
                self.streak = 1
        else:
            self.streak = 1
        
        self.last_claim = now
        self.save()
        
        transaction = Transaction.objects.create(
            user=self.user,
            amount=self.daily_amount,
            transaction_type='daily_reward',
            description=f'Recompensa diária - Dia {self.streak}'
        )
        
        return transaction
