import pytest
from models.clase import Clase
from services.clase_service import create_clase, list_clases

@pytest.mark.django_db
def test_create_clase():
    clase = create_clase(title="Python Básico", description="Aprendé desde cero")
    assert clase.id is not None
    assert clase.title == "Python Básico"

@pytest.mark.django_db
def test_list_clases():
    Clase.objects.create(title="Curso 1", description="Desc 1")
    Clase.objects.create(title="Curso 2", description="Desc 2")
    clases = list_clases()
    assert len(clases) == 2
