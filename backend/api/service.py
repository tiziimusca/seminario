from .serializers import ContraOfertaSerializer

def crear_contraoferta(data, propuesta, context=None):
     # se crea una contraoferta
    serializer = ContraOfertaSerializer(data=data, context=context or {})
    if serializer.is_valid():
        serializer.save(state="pendiente", propuestaId=propuesta)
        return serializer, None
    return None, serializer.errors