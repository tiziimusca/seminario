# filters.py
import django_filters
from .models import Clase, User
from django.db.models import JSONField
from django_filters.filters import CharFilter

class ClaseFilter(django_filters.FilterSet):
    title = CharFilter(field_name='title', lookup_expr='icontains')
    description = CharFilter(field_name='description', lookup_expr='icontains')
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Clase
        fields = [
            'title', 'description', 'created_at', 'created_after', 'created_before'
        ]

class UserFilter(django_filters.FilterSet):
    nombre = CharFilter(field_name='nombre', lookup_expr='icontains')
    apellido = CharFilter(field_name='apellido', lookup_expr='icontains')
    email = CharFilter(field_name='email', lookup_expr='icontains')
    fecha_nacimiento = django_filters.DateFilter(field_name='fecha_nacimiento', lookup_expr='gte')
    descripcion = CharFilter(field_name='descripcion', lookup_expr='icontains')
    horario = CharFilter(field_name='horario', lookup_expr='icontains')
    
    class Meta:
        model = User
        fields = [
            'nombre', 'apellido', 'email', 'fecha_nacimiento', 'descripcion', 'horario'
        ]
