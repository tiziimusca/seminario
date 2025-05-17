from rest_framework.permissions import DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from ..models import Reseña
from ..serializers import ReseñaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import ReseñaFilter

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


class ReseñaViewSet(viewsets.ModelViewSet):

    queryset = Reseña.objects.all()
    serializer_class = ReseñaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ReseñaFilter

    @extend_schema(
        summary="Obtener todas las reseñas",
        description="Devuelve una lista de todas las reseñas.",
        responses={
            200: ReseñaSerializer(many=True),
            401: unauthorized_response
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Obtener una reseña por ID",
        description="Devuelve una reseña por ID.",
        responses={200: ReseñaSerializer, 401: unauthorized_response, 404: {
            "description": "No encontrado"}}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Crear una reseña",
        request=ReseñaSerializer,
        responses={
            201: ReseñaSerializer,
            400: bad_request_response,
            401: unauthorized_response
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary="Actualiza una reseña",
        description="Reemplaza completamente una reseña existente por ID.",
        request=ReseñaSerializer,
        responses={
            200: ReseñaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Actualizar parcialmente una reseña",
        description="Modifica solo algunos campos de una reseña existente.",
        request=ReseñaSerializer,
        responses={
            200: ReseñaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Eliminar una reseña",
        description="Elimina una reseña.",
        responses={
            204: {"description": "Eliminado exitosamente"},
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
