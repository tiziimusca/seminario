import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

SECRET_KEY = 'tu-secret-key-aqui'

DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'backend.models',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQL_DATABASE', 'db_name'),
        'USER': os.getenv('MYSQL_USER', 'user'),
        'PASSWORD': os.getenv('MYSQL_PASSWORD', 'password'),
        'HOST': 'db',
        'PORT': '3306',
    }
}

ROOT_URLCONF = 'urls'
