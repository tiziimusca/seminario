from rest_framework.permissions import DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from ..models import Queja
from ..serializers import QuejaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import QuejaFilter

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


class QuejaViewSet(viewsets.ModelViewSet):

    queryset = Queja.objects.all()
    serializer_class = QuejaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = QuejaFilter

    @extend_schema(
        summary="Obtener todas las quejas",
        description="Devuelve una lista de todas las quejas.",
        responses={
            200: QuejaSerializer(many=True),
            401: unauthorized_response
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Obtener una queja por ID",
        description="Devuelve una queja por ID.",
        responses={200: QuejaSerializer, 401: unauthorized_response, 404: {
            "description": "No encontrado"}}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Crear una queja",
        request=QuejaSerializer,
        responses={
            201: QuejaSerializer,
            400: bad_request_response,
            401: unauthorized_response
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Actualiza una queja",
        description="Reemplaza completamente una queja existente por ID.",
        request=QuejaSerializer,
        responses={
            200: QuejaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Actualizar parcialmente una queja",
        description="Modifica solo algunos campos de una queja existente.",
        request=QuejaSerializer,
        responses={
            200: QuejaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Eliminar una queja",
        description="Elimina una queja.",
        responses={
            204: {"description": "Eliminado exitosamente"},
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
