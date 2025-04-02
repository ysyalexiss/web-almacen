# Generated by Django 5.1.6 on 2025-03-07 05:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tareas', '0002_proveedor_materialproducto'),
    ]

    operations = [
        migrations.CreateModel(
            name='NotaEntrada',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('factura', models.CharField(max_length=255)),
                ('folio_fiscal', models.CharField(max_length=255)),
                ('fecha', models.DateField()),
                ('proveedor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tareas.proveedor')),
            ],
        ),
        migrations.CreateModel(
            name='DetalleNotaEntrada',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('unidad', models.CharField(max_length=50)),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('costo_total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('material', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tareas.materialproducto')),
                ('nota_entrada', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='detalles', to='tareas.notaentrada')),
            ],
        ),
    ]
