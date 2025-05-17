from rest_framework import serializers
from django.apps import apps
from .models import Clase, Propuesta, User

# Generador automático de serializers para todos los modelos
model_list = apps.get_app_config('api').get_models()

models = apps.get_models()


serializers_dict = {}

for model in models:
    class Meta:
        model = model
        fields = '__all__'

    serializer_class = type(
        f"{model.__name__}Serializer", (serializers.ModelSerializer,), {"Meta": Meta})
    serializers_dict[model.__name__] = serializer_class

for model in model_list:
    class Meta:
        model = model
        fields = '__all__'

    serializer_class = type(
        f'{model.__name__}Serializer',
        (serializers.ModelSerializer,),
        {'Meta': Meta}
    )
    serializers_dict[model.__name__] = serializer_class


class ClaseSerializer(serializers.ModelSerializer):
    """
    Serializer para la tabla Clase con enlaces HATEOAS.
    """
    links = serializers.SerializerMethodField()

    class Meta:
        model = Clase
        fields = [f.name for f in model._meta.fields] + ['links']

    def get_links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        base_url = request.build_absolute_uri(f"/api/clase/{obj.pk}/")
        return {
            "self": base_url,
            "update": base_url,
            "delete": base_url
        }


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para la tabla user con enlaces HATEOAS.
    """
    links = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [f.name for f in model._meta.fields] + ['links']

    def get_links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        base_url = request.build_absolute_uri(f"/api/user/{obj.pk}/")
        return {
            "self": base_url,
            "update": base_url,
            "delete": base_url
        }


class PropuestaSerializer(serializers.ModelSerializer):
    """
    Serializer para la tabla Propuesta con enlaces HATEOAS.
    """
    links = serializers.SerializerMethodField()

    class Meta:
        model = Propuesta
        fields = [f.name for f in model._meta.fields] + ['links']
        # cuando se implemete la autentificacion agregar, userId
        read_only_fields = ['state']

    def get_links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        base_url = request.build_absolute_uri(f"/api/propuesta/{obj.pk}/")
        return {
            "self": base_url,
            "update": base_url,
            "delete": base_url
        }
