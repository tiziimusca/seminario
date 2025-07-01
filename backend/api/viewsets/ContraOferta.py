from rest_framework.permissions import DjangoModelPermissions
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from ..models import ContraOferta, Propuesta, Clase, User
from ..serializers import ClaseSerializer, ContraOfertaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from api.filters import ContraOfertaFilter
from django.db import transaction

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
    """"
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
        return super().create(request, *args, **kwargs) """

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
    
    @extend_schema(
        summary= "cancelar contraoferta",
        request=None,
        responses={
            200: ContraOfertaSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response
        }
    )
    @action(detail=True, methods=["post"], url_path="cancelar", url_name="cancelar_contraoferta")
    def cancelar_contraOferta(self, request, pk=None):
        contraOferta = self.get_object()
        if contraOferta.state in ["cancelado", "expirado"]:
            return Response(
                {"detail": f"La contraoferta ya está {contra_oferta.state}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        contraOferta.state = "cancelado"
        contraOferta.save()
        serializer = self.get_serializer(contraOferta)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @extend_schema(
        summary="Aceptar una contraoferta",    #una ves aceptada la contraoferta, se crea la clase 
        request=None,
        responses={
            201: ClaseSerializer,
            400: bad_request_response,
            401: unauthorized_response,
            404: not_found_response   
        }
    )
    @action(detail=True, methods=["post"], url_path="aceptar", url_name="aceptar_contraoferta")
    def aceptar_contraOferta(self, request, pk=None):
        contra_oferta = self.get_object()
        propuesta = get_object_or_404(Propuesta, id=contra_oferta.propuestaId.id)

        if contra_oferta.state in ["cancelado", "expirado", "aceptada"]:
            return Response(
                {"detail": f"La contraoferta ya está {contra_oferta.state}."},
                status=status.HTTP_400_BAD_REQUEST
        )

        try: 
            guest = User.objects.get(id=contra_oferta.userId) #si no existe el usuario, se retorna un error
            owner = User.objects.get(id=propuesta.userId.id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        

        with transaction.atomic():               #si no se puede crear la clase, se deshace todo lo que se hizo
            clase = Clase.objects.create(
                title=propuesta.title,
                tema=propuesta.tema,
                guestId=guest,
                ownerId= owner,
                date=contra_oferta.date_available,
                price=contra_oferta.new_price,
                duration=contra_oferta.duration
            )
            
            contra_oferta.state = "aceptada"
            propuesta.state = "aceptada"
            contra_oferta.save()
            propuesta.save()
        serializer = ClaseSerializer(clase)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

