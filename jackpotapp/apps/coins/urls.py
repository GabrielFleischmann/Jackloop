from django.urls import include, path
from rest_framework import routers
from . import views

app_name = 'coins'

router = routers.DefaultRouter()
router.register('transactions', views.TransactionViewSet, basename='transactions')

urlpatterns = [
    path('balance/<int:user_id>/', views.UserBalanceView.as_view(), name='user-balance'),
    path('daily/claim/', views.ClaimDailyView.as_view(), name='claim-daily'),
    path('daily/<int:user_id>/', views.DailyCoinStatusView.as_view(), name='daily-status'),
    path('', include(router.urls)),
]
