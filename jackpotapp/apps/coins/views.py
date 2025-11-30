from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Q
from .models import Transaction, DailyCoin
from users.models import User
from .serializers import (
    TransactionSerializer, 
    DailyCoinSerializer, 
    ClaimDailySerializer,
    UserBalanceSerializer
)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        queryset = Transaction.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'success': True,
            'transaction': serializer.data,
            'message': 'Transação criada com sucesso!'
        }, status=status.HTTP_201_CREATED, headers=headers)


class UserBalanceView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Usuário não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        transactions = Transaction.objects.filter(user=user)
        
        total_earned = transactions.filter(amount__gt=0).aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        total_spent = abs(transactions.filter(amount__lt=0).aggregate(
            total=Sum('amount')
        )['total'] or 0)
        
        balance = total_earned - total_spent
        
        data = {
            'user_id': user_id,
            'balance': balance,
            'total_earned': total_earned,
            'total_spent': total_spent
        }
        
        serializer = UserBalanceSerializer(data)
        return Response(serializer.data)


class ClaimDailyView(APIView):
    def post(self, request):
        serializer = ClaimDailySerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transaction = serializer.save()
        
        return Response({
            'success': True,
            'transaction': TransactionSerializer(transaction).data,
            'message': f'Parabéns! Você recebeu {transaction.amount} moedas!'
        }, status=status.HTTP_201_CREATED)


class DailyCoinStatusView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Usuário não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        daily_coin, created = DailyCoin.objects.get_or_create(user=user)
        serializer = DailyCoinSerializer(daily_coin)
        
        return Response(serializer.data)
