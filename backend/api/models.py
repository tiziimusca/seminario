from django.db import models

class Clase(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class contraOferta(models.Model):
    clase = models.ForeignKey(Clase, on_delete=models.CASCADE)
    userId = models.IntegerField()
    montoPropuesto = models.DecimalField(max_digits=10, decimal_places=2)
    fechaDisponible = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class User(models.Model):
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    email = models.EmailField()
    fecha_nacimiento = models.DateField()
    descripcion = models.TextField()
    horario = models.TextField()

    def __str__(self):
        return self.nombre, self.apellido, self.email
    


