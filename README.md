MatchEd es una plataforma donde los usuarios pueden publicar temas que desean aprender y recibir contraofertas de otros usuarios dispuestos a enseñar. Incluye funcionalidades como clases en vivo, calificaciones y reseñas entre usuarios.

Estructura del Monorepo:

/
├── backend/          (Backend en Python + Django)
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── tests/
│   ├── main.py
│   ├── start.py
│   ├── manage.py
│   ├── settings.py
│   └── urls.py
├── backoffice/       (Frontend en Svelte)
├── docker-compose.yml
├── .devcontainer/    (Configuración para VSCode Dev Containers)
└── README.md

Tecnologías principales: Python 3.11 + Django 4.2 para el backend, Svelte para el frontend, MySQL como base de datos, Docker + Docker Compose para orquestación, y pytest + pytest-django para testing.

Configuración Inicial:

1. Clonar el repositorio:
git clone https://github.com/tiziimusca/seminario.git
cd seminario

2. Crear un archivo .env en la raíz del proyecto con las siguientes variables:
DB_NAME=db_name
DB_USER=user
DB_PASSWORD=password
DB_HOST=db
DB_PORT=3306
DJANGO_SECRET_KEY=your_secret_key
DEBUG=True

Levantar todo con Docker Compose:
docker-compose up --build

Servicios disponibles:
- Backend en http://localhost:8000/
- Base de datos MySQL en db:3306
- Frontend en http://localhost:5173/ (cuando esté implementado)

Cómo trabajar en el backend:

Entrar al contenedor:
docker-compose exec backend bash

Migraciones:
python manage.py makemigrations
python manage.py migrate

Crear superusuario:
python manage.py createsuperuser

Correr servidor de desarrollo:
python manage.py runserver 0.0.0.0:8000

Ejecutar tests:

Dentro del contenedor de backend:
pytest

Opcional, para ver cobertura:
pytest --cov=.

Estructura de carpetas de tests:
backend/
└── tests/
    ├── __init__.py
    ├── test_services/
    │   └── test_clase_service.py
    ├── test_api/
    │   └── test_views.py

Cómo trabajar en el frontend:

Entrar al directorio:
cd backoffice

Instalar dependencias:
npm install

Correr el servidor de desarrollo:
npm run dev

El frontend estará disponible en http://localhost:5173/

Flujo de desarrollo recomendado:

1. Levantar containers (docker-compose up)
2. Trabajar en backend (/backend/) o frontend (/backoffice/)
3. Hacer migraciones y correr tests regularmente
4. Commits claros: feature/xxx, fix/xxx, chore/xxx

Roadmap futuro:

- Sistema de clases en vivo
- Sistema de reseñas y calificaciones
- Implementación de pagos (Stripe o MercadoPago)
- Match automático de estudiantes y profesores
- Notificaciones por correo
- Soporte multi-idioma (i18n)

Licencia: Este proyecto está bajo licencia MIT.
