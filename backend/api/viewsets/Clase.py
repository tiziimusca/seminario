from rest_framework.permissions import DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from ..models import Clase
from ..serializers import ClaseSerializer
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import ClaseFilter

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


class ClaseViewSet(viewsets.ModelViewSet):

    queryset = Clase.objects.all()
    serializer_class = ClaseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClaseFilter

    @extend_schema(
        summary="Obtener todas las clases",
        description="Devuelve una lista de todas las clases.",
        responses={
            200: ClaseSerializer(many=True),
            401: unauthorized_response
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
    summary="Obtener una clase por ID",
    description="Devuelve una clase por ID.",
    responses={200: ClaseSerializer, 401: unauthorized_response, 404: {"description": "No encontrado"}}
)
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Crear una clase",
        request=ClaseSerializer,
        responses={
            201: ClaseSerializer,
            400: bad_request_response,
            401: unauthorized_response
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Actualiza una clase",
        description="Reemplaza completamente una clase existente por ID.",
        request=ClaseSerializer,
        responses={
            200: ClaseSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Actualizar parcialmente una clase",
        description="Modifica solo algunos campos de una clase existente.",
        request=ClaseSerializer,
        responses={
            200: ClaseSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Eliminar una clase",
        description="Elimina una clase.",
        responses={
            204: {"description": "Eliminado exitosamente"},
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)