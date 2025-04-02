from rest_framework import viewsets
from .serializer import TareaSerializer, UsuarioSerializer, ProveedorSerializer, MaterialProductoSerializer, NotaEntradaSerializer, SalidaSerializer
from .models import Tareas, Usuario, Proveedor, MaterialProducto, Salida, NotaEntrada
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from django.urls import reverse_lazy
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse



User = get_user_model()

# Create your views here.
class TareaView(viewsets.ModelViewSet):
    serializer_class = TareaSerializer
    queryset = Tareas.objects.all()


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
            }, status=status.HTTP_200_OK)
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)
    

class RegistroUsuarioView(APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProveedorListView(APIView):
    def get(self, request):
        proveedores = Proveedor.objects.all()
        serializer = ProveedorSerializer(proveedores, many=True)
        return Response(serializer.data)
    
class DepartamentoListView(APIView):
    def get(self, request):
        proveedores = Proveedor.objects.all()
        serializer = ProveedorSerializer(proveedores, many=True)
        return Response(serializer.data)

class MaterialProductoListView(APIView):
    def get(self, request):
        materiales = MaterialProducto.objects.all()
        serializer = MaterialProductoSerializer(materiales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class NotaEntradaCreateView(APIView):
    def post(self, request):
        serializer = NotaEntradaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SalidaViewSet(viewsets.ModelViewSet):
    queryset = Salida.objects.all()
    serializer_class = SalidaSerializer


class EntradasHoyView(APIView):
    def get(self, request):
        hoy = timezone.now().date()
        count = NotaEntrada.objects.filter(fecha=hoy).count()
        return Response({"count": count})

class SalidasHoyView(APIView):
    def get(self, request):
        hoy = timezone.now().date()
        count = Salida.objects.filter(fecha=hoy).count()
        return Response({"count": count})
    
class NotaEntradaViewSet(viewsets.ModelViewSet):
    queryset = NotaEntrada.objects.all()
    serializer_class = NotaEntradaSerializer

class NotaEntradaListView(APIView):
    def get(self, request, format=None):
        # entradas guardadas
        entradas = NotaEntrada.objects.all()
        # Serializar los datos
        serializer = NotaEntradaSerializer(entradas, many=True)
        # devolver la respuesta
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class VerificarFacturaView(APIView):
    def post(self, request):
        factura = request.POST.get("factura")  
     
        existe = NotaEntrada.objects.filter(factura=factura).exists()
        return JsonResponse({"existe": existe})
# views.py

from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from django.urls import reverse_lazy
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

User = get_user_model()

class CustomPasswordResetView(PasswordResetView):
    template_name = 'password_reset.html'  # formulario de recuperación de contraseña
    email_template_name = 'password_reset_email.html'  # Plantilla para el correo 
    subject_template_name = 'password_reset_subject.txt'  
    success_url = reverse_lazy('password_reset_done')
    form_class = PasswordResetForm

class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'password_reset_confirm.html' 
    success_url = reverse_lazy('password_reset_complete')
    form_class = SetPasswordForm

class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'El correo electrónico es requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No existe un usuario con este correo electrónico.'}, status=status.HTTP_404_NOT_FOUND)
        
        form = PasswordResetForm({'email': user.email})
        if form.is_valid():
            form.save(
                request=request,
                use_https=request.is_secure(),
                email_template_name='password_reset_email.html',
                subject_template_name='password_reset_subject.txt',
                from_email='alexiszzz162@gmail.com',
            )
            return Response({'message': 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Hubo un error al procesar la solicitud.'}, status=status.HTTP_400_BAD_REQUEST)
        
class ListaUsuariosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Verificar si el usuario es administrador
        if not request.user.rol == 'admin':
            return Response({"error": "No tienes permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)
        
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ActualizarUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        # Verificar si el usuario es administrador
        if not request.user.rol == 'admin':
            return Response({"error": "No tienes permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            usuario = Usuario.objects.get(id=id)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    def post(self, request):
        try:
            # Obtén el token de refresh del cuerpo de la solicitud
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Invalida el token de refresh
            token = RefreshToken(refresh_token)
            token.blacklist()  # Ahora esta función estará disponible

            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class VerificarFolioFiscalView(APIView):
    def post(self, request):
        folio_fiscal = request.data.get("folio_fiscal")
        if not folio_fiscal:
            return Response({"error": "Folio fiscal es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        existe = NotaEntrada.objects.filter(folio_fiscal=folio_fiscal).exists()
        return Response({"existe": existe}, status=status.HTTP_200_OK)