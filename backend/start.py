import django
from django.core.wsgi import get_wsgi_application

def create_app():
    django.setup()
    return get_wsgi_application()
