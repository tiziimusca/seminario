from models.clase import Clase

def create_clase(title, description):
    clase = Clase.objects.create(title=title, description=description)
    return clase

def list_clases():
    return Clase.objects.all()
