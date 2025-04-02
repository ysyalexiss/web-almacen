from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework import routers
from tareas import views
from .views import LoginView, RegistroUsuarioView, VerificarFolioFiscalView, LogoutView, ListaUsuariosView, ActualizarUsuarioView, NotaEntradaCreateView, VerificarFacturaView, ProveedorListView, MaterialProductoListView, NotaEntradaCreateView, SalidaViewSet, EntradasHoyView, SalidasHoyView, NotaEntradaListView, NotaEntradaViewSet, CustomPasswordResetView, CustomPasswordResetConfirmView, PasswordResetRequestView
from rest_framework.views import APIView
from django.views.generic import TemplateView  # Importa TemplateView aquí



# Configuración del router para las tareas
router = routers.DefaultRouter()
router.register(r'tareas', views.TareaView, 'tareas')
router.register(r'salidas', SalidaViewSet, basename='salidas')
    

urlpatterns = [
    # Rutas de la API
    path("api/v1/", include(router.urls)),

    # Documentación de la API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),  
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),  # Swagger UI
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),  # Redoc

    # Autenticación y registro
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),

    # Nota de entrada
    path('api/entrada/', NotaEntradaCreateView.as_view(), name='nota_entrada'),
    path('api/proveedores/', ProveedorListView.as_view(), name='proveedores-list'),
    path('api/materiales/', MaterialProductoListView.as_view(), name='materiales-list'),
    path('api/nota-entrada/', views.NotaEntradaCreateView.as_view(), name='nota_entrada'),
    path('api/nota-entrada/list/', NotaEntradaListView.as_view(), name='nota_entrada_list'), 
    path('api/salidas/', SalidaViewSet.as_view({'post': 'create'}), name='salidas'),
    path('api/entradas-hoy/', EntradasHoyView.as_view(), name='entradas-hoy'),
    path('api/salidas-hoy/', SalidasHoyView.as_view(), name='salidas-hoy'),
    path('tareas/api/verificar-factura/', VerificarFacturaView.as_view(), name='verificar_factura'),
    path('password-reset/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', TemplateView.as_view(template_name='password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', TemplateView.as_view(template_name='password_reset_complete.html'), name='password_reset_complete'),
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='api_password_reset'),
    path('api/usuarios/', ListaUsuariosView.as_view(), name='lista_usuarios'),
    path('api/usuarios/<int:id>/', ActualizarUsuarioView.as_view(), name='actualizar_usuario'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/verificar-folio-fiscal/', VerificarFolioFiscalView.as_view(), name='verificar-folio-fiscal'),
    path('api/verificar-factura/', VerificarFacturaView.as_view(), name='verificar_factura'),
    
    
]