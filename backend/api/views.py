from rest_framework import viewsets
from django.apps import apps
from .serializers import serializers_dict

viewsets_dict = {}

for model in apps.get_app_config('api').get_models():
    serializer = serializers_dict[model.__name__]
    
    viewset_class = type(
        f'{model.__name__}ViewSet',
        (viewsets.ModelViewSet,),
        {
            'queryset': model.objects.all(),
            'serializer_class': serializer
        }
    )
    
    viewsets_dict[model.__name__] = viewset_class
