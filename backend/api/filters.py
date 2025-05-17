# filters.py
import django_filters
from .models import Clase, Propuesta, User, ContraOferta, Pago, Calificacion, Reseña, Queja
from django.db.models import JSONField
from django_filters.filters import CharFilter


class ClaseFilter(django_filters.FilterSet):
    title = CharFilter(field_name='title', lookup_expr='icontains')
    tema = CharFilter(field_name='tema', lookup_expr='icontains')
    guestId = CharFilter(field_name='guestId', lookup_expr='icontains')
    ownerId = CharFilter(field_name='ownerId', lookup_expr='icontains')
    date = django_filters.DateTimeFilter(field_name='date', lookup_expr='gte')
    price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    duration = django_filters.DurationFilter(
        field_name='duration', lookup_expr='gte')

    class Meta:
        model = Clase
        fields = [
            'title', 'tema', 'guestId', 'ownerId', 'date', 'price', 'duration'
        ]


class UserFilter(django_filters.FilterSet):
    name = CharFilter(field_name='name', lookup_expr='icontains')
    surname = CharFilter(field_name='surname', lookup_expr='icontains')
    email = CharFilter(field_name='email', lookup_expr='icontains')
    birth_date = django_filters.DateFilter(
        field_name='birth_date', lookup_expr='gte')
    description = CharFilter(field_name='description', lookup_expr='icontains')
    horary = django_filters.CharFilter(
        field_name='horary', lookup_expr='icontains')

    class Meta:
        model = User
        fields = [
            'name', 'surname', 'email', 'birth_date', 'description', 'horary'
        ]


class PropuestaFilter(django_filters.FilterSet):
    userId = CharFilter(field_name='userId', lookup_expr='icontains')
    title = CharFilter(field_name='title', lookup_expr='icontains')
    tema = CharFilter(field_name='tema', lookup_expr='icontains')
    description = CharFilter(field_name='description', lookup_expr='icontains')
    initial_price = django_filters.NumberFilter(
        field_name='initial_price', lookup_expr='gte')
    state = CharFilter(field_name='state', lookup_expr='icontains')
    date_available = django_filters.DateTimeFilter(
        field_name='date_available', lookup_expr='gte')

    class Meta:
        model = Propuesta
        fields = [
            'userId', 'description', 'initial_price', 'state', 'date_available'
        ]


class ContraOfertaFilter(django_filters.FilterSet):
    propuestaId = CharFilter(field_name='propuestaId', lookup_expr='icontains')
    userId = CharFilter(field_name='userId', lookup_expr='icontains')
    new_price = django_filters.NumberFilter(
        field_name='new_price', lookup_expr='gte')
    date_available = django_filters.DateTimeFilter(
        field_name='date_available', lookup_expr='gte')

    class Meta:
        model = ContraOferta
        fields = [
            'propuestaId', 'userId', 'new_price', 'date_available'
        ]


class PagoFilter(django_filters.FilterSet):
    price = django_filters.NumberFilter(
        field_name='price', lookup_expr='gte')
    pagadorId = CharFilter(field_name='pagadorId', lookup_expr='icontains')
    beneficiarioId = CharFilter(
        field_name='beneficiarioId', lookup_expr='icontains')
    claseId = CharFilter(field_name='claseId', lookup_expr='icontains')

    class Meta:
        model = Pago
        fields = [
            'price', 'pagadorId', 'beneficiarioId', 'claseId'
        ]


class CalificacionFilter(django_filters.FilterSet):
    calificacion = django_filters.NumberFilter(
        field_name='calificacion', lookup_expr='gte')
    calificadoId = CharFilter(
        field_name='calificadoId', lookup_expr='icontains')
    calificadorId = CharFilter(
        field_name='calificadorId', lookup_expr='icontains')
    claseId = CharFilter(field_name='claseId', lookup_expr='icontains')
    date = django_filters.DateTimeFilter(
        field_name='date', lookup_expr='gte')

    class Meta:
        model = Calificacion
        fields = [
            'calificadoId', 'calificadorId', 'claseId', 'calificacion', 'date'
        ]


class ReseñaFilter(django_filters.FilterSet):
    reseñadoId = CharFilter(field_name='reseñadoId', lookup_expr='icontains')
    reseñadorId = CharFilter(field_name='reseñadorId', lookup_expr='icontains')
    reseña = CharFilter(field_name='reseña', lookup_expr='icontains')
    date = django_filters.DateTimeFilter(
        field_name='date', lookup_expr='gte')

    class Meta:
        model = Reseña
        fields = [
            'reseñadoId', 'reseñadorId', 'reseña', 'date'
        ]


class QuejaFilter(django_filters.FilterSet):
    queja = CharFilter(field_name='queja', lookup_expr='icontains')
    date = django_filters.DateTimeFilter(
        field_name='date', lookup_expr='gte')

    class Meta:
        model = Queja
        fields = [
            'queja', 'date'
        ]
