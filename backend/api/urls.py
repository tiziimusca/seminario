from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets.Clase import ClaseViewSet
from .viewsets.User import UserViewSet
from .viewsets.Propuesta import PropuestaViewSet

router = DefaultRouter()
router.register(r'clase', ClaseViewSet)
router.register(r'user', UserViewSet)
router.register(r'propuesta', PropuestaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
