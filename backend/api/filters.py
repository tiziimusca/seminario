# filters.py
import django_filters
from .models import Clase
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
