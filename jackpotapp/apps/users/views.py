from rest_framework import viewsets
from .models import User
from .serializer import UserSerializer, LoginSerializer

#login imports
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
     
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'success': True, 'user' : UserSerializer(user).data }, status=status.HTTP_404_NOT_FOUND)

        if user.password != password:
            return Response({'detail': 'Credenciais inválidas!'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'detail': 'Login realizado!'})