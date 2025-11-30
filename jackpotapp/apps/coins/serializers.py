from rest_framework import serializers
from .models import Transaction, DailyCoin
from users.models import User


class TransactionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'user_name', 'amount', 'transaction_type', 'description', 'created_at']
        read_only_fields = ['created_at']


class DailyCoinSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    can_claim_now = serializers.SerializerMethodField()
    
    class Meta:
        model = DailyCoin
        fields = ['id', 'user', 'user_name', 'last_claim', 'streak', 'daily_amount', 'can_claim_now']
        read_only_fields = ['last_claim', 'streak']
    
    def get_can_claim_now(self, obj):
        return obj.can_claim()


class ClaimDailySerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    def validate(self, data):
        user = data['user']
        daily_coin, created = DailyCoin.objects.get_or_create(user=user)
        
        if not daily_coin.can_claim():
            raise serializers.ValidationError('Você já coletou suas moedas diárias hoje. Volte amanhã!')
        
        data['daily_coin'] = daily_coin
        return data
    
    def save(self):
        daily_coin = self.validated_data['daily_coin']
        transaction = daily_coin.claim()
        return transaction


class UserBalanceSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    balance = serializers.IntegerField()
    total_earned = serializers.IntegerField()
    total_spent = serializers.IntegerField()
