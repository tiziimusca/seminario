from rest_framework.permissions import DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from ..models import User
from ..serializers import userSerializer
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import UserFilter

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

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la tabla User.
    """
    queryset = User.objects.all()
    serializer_class = userSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter

    @extend_schema(
        summary="Obtener todos los usuarios",
        description="Devuelve una lista de todos los usuarios.",
        responses={
            200: userSerializer(many=True),
            401: unauthorized_response
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @extend_schema(
        summary="Obtener un usuario por ID",
        description="Devuelve un usuario por ID.",
        responses={
            200: userSerializer, 
            401: unauthorized_response, 
            404: {"description": "No encontrado"}}
    )
    def retrive(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Crear una usuario",
        request=userSerializer,
        responses={
            201: userSerializer,
            400: bad_request_response,
            401: unauthorized_response
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        summary="Actualizar un usuario",
        description="Reemplaza completamente un usuario existente por ID.",
        request= userSerializer,
        responses={
            200: userSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        summary="Actualizar parcialmente un usuario",
        description="Modifica solo algunos campos de un usuario existente.",
        request=userSerializer,
        responses={
            200: userSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        summary="Eliminar un usuario",
        description="Elimina un usuario por ID.",
        responses={
            204: {"description": "Eliminado exitosamente"},
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    