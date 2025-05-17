from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets.Clase import ClaseViewSet
from .viewsets.User import UserViewSet
from .viewsets.Propuesta import PropuestaViewSet
from .viewsets.ContraOferta import ContraOfertaViewSet
from .viewsets.Calificacion import CalificacionViewSet
from .viewsets.Pago import PagoViewSet
from .viewsets.Reseña import ReseñaViewSet
from .viewsets.Queja import QuejaViewSet

router = DefaultRouter()
router.register(r'clase', ClaseViewSet)
router.register(r'user', UserViewSet)
router.register(r'propuesta', PropuestaViewSet)
router.register(r'contraoferta', ContraOfertaViewSet)
router.register(r'calificacion', CalificacionViewSet)
router.register(r'pago', PagoViewSet)
router.register(r'reseña', ReseñaViewSet)
router.register(r'queja', QuejaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
