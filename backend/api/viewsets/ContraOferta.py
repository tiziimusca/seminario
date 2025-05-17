from rest_framework.permissions import DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from ..models import ContraOferta
from ..serializers import ContraOfertaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import ContraOfertaFilter

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


class ContraOfertaViewSet(viewsets.ModelViewSet):

    queryset = ContraOferta.objects.all()
    serializer_class = ContraOfertaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ContraOfertaFilter

    @extend_schema(
        summary="Obtener todas las contraofertas",
        description="Devuelve una lista de todas las contraofertas.",
        responses={
            200: ContraOfertaSerializer(many=True),
            401: unauthorized_response
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Obtener una contraoferta por ID",
        description="Devuelve una contraoferta por ID.",
        responses={200: ContraOfertaSerializer, 401: unauthorized_response, 404: {
            "description": "No encontrado"}}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Crear una contraoferta",
        request=ContraOfertaSerializer,
        responses={
            201: ContraOfertaSerializer,
            400: bad_request_response,
            401: unauthorized_response
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Actualiza una contraoferta",
        description="Reemplaza completamente una contraoferta existente por ID.",
        request=ContraOfertaSerializer,
        responses={
            200: ContraOfertaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Actualizar parcialmente una contraoferta",
        description="Modifica solo algunos campos de una contraoferta existente.",
        request=ContraOfertaSerializer,
        responses={
            200: ContraOfertaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Eliminar una contraoferta",
        description="Elimina una contraoferta.",
        responses={
            204: {"description": "Eliminado exitosamente"},
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
