# Generated by Django 5.1.6 on 2025-03-14 04:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tareas', '0010_alter_salida_proveedor'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='materialproducto',
            name='proveedor',
        ),
    ]
