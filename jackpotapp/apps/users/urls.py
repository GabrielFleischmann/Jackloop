from django.urls import include, path
from rest_framework import routers
from . import views

app_name = 'users'

router = routers.DefaultRouter()
router.register('', views.UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', views.LoginView.as_view(), name='login'),
]