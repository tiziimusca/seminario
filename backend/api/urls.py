from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets.Clase import ClaseViewSet
from .viewsets.User import UserViewSet

router = DefaultRouter()
router.register(r'clase', ClaseViewSet)
router.register(r'user', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
