from rest_framework.permissions import DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from ..models import Pago
from ..serializers import PagoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import PagoFilter

unauthorized_response = OpenApiResponse(
    response={"detail": "No autorizado"},
    description="No autorizado (Token inválido o ausente)"
)

not_found_response = OpenApiResponse(
    response={"detail": "No encontrado"},
    description="No encontrado"
)

bad_request_response = OpenApiResponse(
    response={"detail": "Datos inválidos"},
    description="Datos inválidos"
)


class PagoViewSet(viewsets.ModelViewSet):

    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PagoFilter

    @extend_schema(
        summary="Obtener todos los pagos",
        description="Devuelve una lista de todos los pagos.",
        responses={
            200: PagoSerializer(many=True),
            401: unauthorized_response
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Obtener un pago por ID",
        description="Devuelve un pago por ID.",
        responses={200: PagoSerializer, 401: unauthorized_response, 404: {
            "description": "No encontrado"}}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Crear un pago",
        request=PagoSerializer,
        responses={
            201: PagoSerializer,
            400: bad_request_response,
            401: unauthorized_response
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Actualiza un pago",
        description="Reemplaza completamente un pago existente por ID.",
        request=PagoSerializer,
        responses={
            200: PagoSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Actualizar parcialmente un pago",
        description="Modifica solo algunos campos de un pago existente.",
        request=PagoSerializer,
        responses={
            200: PagoSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Eliminar un pago",
        description="Elimina un pago.",
        responses={
            204: {"description": "Eliminado exitosamente"},
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
