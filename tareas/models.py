from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class Tareas(models.Model):
    titutlo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    hecho = models.BooleanField(default=False)

    def __str__(self):
        return self.titutlo
    

class Usuario(AbstractUser):
    ROLES = (
        ('admin', 'Administrador'),
        ('comun', 'Común'),
    )
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    rol = models.CharField(max_length=10, choices=ROLES, default='comun')

    def __str__(self):
        return self.username
    
class Proveedor(models.Model):
    nombre_proveedor = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nombre_proveedor

class MaterialProducto(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    material_servicio = models.CharField(max_length=255)
    

    def __str__(self):
        return f"{self.codigo} - {self.material_servicio}"
    

class NotaEntrada(models.Model):
    proveedor =  models.CharField(max_length=255)
    factura = models.CharField(max_length=255)
    folio_fiscal = models.CharField(max_length=255)
    fecha = models.DateField()

    def __str__(self):
        return f"Nota de Entrada {self.id} - {self.proveedor.nombre_proveedor}"
    

class DetalleNotaEntrada(models.Model):
    nota_entrada = models.ForeignKey(NotaEntrada, on_delete=models.CASCADE, related_name='detalles')
    material = models.CharField(max_length=50)  
    articulo = models.CharField(max_length=255, blank=True, null=True)
    cantidad = models.IntegerField()
    unidad = models.CharField(max_length=50)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    costo_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detalle {self.id} - {self.material.material_servicio}"

class Salida(models.Model):
    proveedor = models.CharField(max_length=255)
    factura = models.CharField(max_length=255)
    folio_fiscal = models.CharField(max_length=255)
    fecha = models.DateField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Salida {self.id} - {self.proveedor.nombre_proveedor}"


class DetalleSalida(models.Model):
    salida = models.ForeignKey(Salida, on_delete=models.CASCADE, related_name='detalles')
    descripcion = models.CharField(max_length=255)  
    unidad = models.CharField(max_length=50)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    importe = models.DecimalField(max_digits=10, decimal_places=2)
    observaciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Detalle {self.id} - {self.descripcion}"