from django.urls import path
from .views import create_clase_view, list_clase_view

urlpatterns = [
    path('clases/', list_clases_view),
    path('clases/create/', create_clase_view),
]
