from rest_framework.permissions import DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from ..models import Propuesta
from ..serializers import PropuestaSerializer, ContraOfertaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from api.filters import PropuestaFilter
from django.utils import timezone
from ..service import crear_contraoferta 

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

class PropuestaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para la tabla Propuesta.
    """
    queryset = Propuesta.objects.all()
    serializer_class = PropuestaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PropuestaFilter

    @extend_schema(
        summary="Obtener todas las propuestas",
        description="Devuelve una lista de todas las propuestas.",
        request=None,
        responses={
            200: PropuestaSerializer(many=True),
            401: unauthorized_response
        }
    )
    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()
        for propuesta in queryset:
           propuesta.verificar_expiracion()
        return super().list(request, *args, **kwargs)
    
    @extend_schema(
        summary="Obtener una propuesta por ID",
        description="Devuelve una propuesta por ID.",
        responses={
            200: PropuestaSerializer, 
            401: unauthorized_response, 
            404: {"description": "No encontrado"}}
    )
    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.verificar_expiracion()
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        summary="Crear una propuesta",
        request=PropuestaSerializer,
        responses={
            201: PropuestaSerializer,
            400: bad_request_response,
            401: unauthorized_response
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    def perform_create(self, serializer):
        serializer.save(state = "pendiente") # Cambia el estado a "activo" al crearse, agregar userId = self.request.user cuando se implemente la autenticación
    
    @extend_schema(
        summary="Actualizar una propuesta",
        request=PropuestaSerializer,
        responses={
            200: PropuestaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.verificar_expiracion()
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        summary = "actualizar parcialmente una propuesta",
        request = PropuestaSerializer,
        responses = {
            200: PropuestaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def partial_update(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.verificar_expiracion()
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        summary="Eliminar una propuesta",
        responses={
            204: OpenApiResponse(
                response=None,
                description="Propuesta eliminada"
            ),
            401: unauthorized_response,
            404: not_found_response
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    @extend_schema(
        summary="Cancelar una propuesta",
        request = None,
        responses={
            200: PropuestaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    @action(detail=True, methods=['post'], url_path='cancelar', url_name='cancelar_propuesta')
    def cancel(self):
        obj = self.get_object()
        if obj.state in ["cancelado", "expirado"]:
            return Response(
                {"detail": f"La Propuesta ya está {obj.state}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        obj.state = "cancelado"
        obj.save()
        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @extend_schema(
        summary="Ofertar en una propuesta",
        request=ContraOfertaSerializer,
        responses=ContraOfertaSerializer
    )
    @action(detail=True, methods=['post'], url_path='Ofertar')
    def ofertar(self, request, pk=None):
        propuesta = self.get_object()
        
        if propuesta.state in ["cancelado", "expirado"]:
            return Response(
                {"detail": f"La Propuesta ya está {propuesta.state}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        serializer, errors = crear_contraoferta( data, propuesta, context={'request': request})

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        propuesta.state = "ofertada"
        propuesta.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)