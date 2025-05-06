import pytest
from django.urls import reverse
from models.clase import Clase

@pytest.mark.django_db
def test_list_clases_view(client):
    Clase.objects.create(title="Curso 1", description="Desc 1")
    Clase.objects.create(title="Curso 2", description="Desc 2")

    response = client.get('/api/clases/')
    assert response.status_code == 200
    data = response.json()
    assert len(data['clases']) == 2

@pytest.mark.django_db
def test_create_clase_view(client):
    payload = {
        "title": "Curso de Django",
        "description": "Desde básico hasta avanzado"
    }
    response = client.post('/api/clase/create/', payload, content_type='application/json')
    assert response.status_code == 200
    data = response.json()
    assert 'id' in data
    assert data['title'] == payload['title']
