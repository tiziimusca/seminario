from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import viewsets_dict

from .viewsets.Clase import ClaseViewSet

router = DefaultRouter()
router.register(r'clase', ClaseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
