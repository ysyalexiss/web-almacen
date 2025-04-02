from rest_framework import serializers
from .models import Tareas, Usuario, Proveedor, MaterialProducto, NotaEntrada, DetalleNotaEntrada, Salida, DetalleSalida
from rest_framework.views import APIView



class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tareas
        #fields = ('id', 'titutlo', 'descripcion', 'hecho')
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = '__all__'

    def validate_username(self, value):
        # nombre de usuario sea único
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("El nombre de usuario ya está registrado.")
        return value

    def validate_email(self, value):
        # correo electrónico sea único
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("El correo electrónico ya está registrado.")
        return value
    
    def create(self, validated_data):
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email', ''),
            telefono=validated_data.get('telefono', ''),
            direccion=validated_data.get('direccion', ''),
            rol=validated_data.get('rol', 'comun')
        )
        return user
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre_proveedor'] 

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre_departamento'] 

class MaterialProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialProducto
        fields = ['codigo', 'material_servicio']

class DetalleNotaEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleNotaEntrada
        fields = ['id','material', 'articulo', 'cantidad', 'unidad', 'precio_unitario', 'costo_total']

class NotaEntradaSerializer(serializers.ModelSerializer):
    detalles = DetalleNotaEntradaSerializer(many=True)

    class Meta:
        model = NotaEntrada
        fields = ['id','proveedor', 'factura', 'folio_fiscal', 'fecha', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        nota_entrada = NotaEntrada.objects.create(**validated_data)
        for detalle_data in detalles_data:
            DetalleNotaEntrada.objects.create(nota_entrada=nota_entrada, **detalle_data)
        return nota_entrada
    
    def validate_factura(self, value):
        # Verificar si ya existe una entrada con la misma factura
        if NotaEntrada.objects.filter(factura=value).exists():
            raise serializers.ValidationError("Ya existe una entrada con esta factura.")
        return value
    

class DetalleSalidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleSalida
        fields = ['descripcion', 'unidad', 'precio_unitario', 'importe', 'observaciones']


class SalidaSerializer(serializers.ModelSerializer):
    detalles = DetalleSalidaSerializer(many=True)

    class Meta:
        model = Salida
        fields = ['proveedor', 'factura', 'folio_fiscal', 'fecha', 'subtotal', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        salida = Salida.objects.create(**validated_data)
        for detalle_data in detalles_data:
            DetalleSalida.objects.create(salida=salida, **detalle_data)
        return salida