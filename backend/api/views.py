from django.http import JsonResponse
from services.clase_service import create_clase, list_clases
import json

def create_clase_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        clase = create_clase(data['title'], data['description'])
        return JsonResponse({'id': clase.id, 'title': clase.title})

def list_clases_view(request):
    if request.method == 'GET':
        clases = list_clases()
        return JsonResponse({'clases': [{'id': c.id, 'title': c.title} for c in clases]})
