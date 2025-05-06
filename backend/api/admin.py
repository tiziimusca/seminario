from django.contrib import admin
from django.apps import apps
from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework.authtoken.models import TokenProxy

# Obtiene todos los modelos de la aplicación
models = apps.get_models()

# admin.site.unregister(TokenProxy)

# Registra cada modelo automáticamente en el Admin
for model in models:
    if model._meta.model_name == 'tokenproxy':
        continue
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass  # Si el modelo ya está registrado, lo ignora