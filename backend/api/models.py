from django.utils import timezone
import pytz
from django.db import models


class Clase(models.Model):
    title = models.CharField(max_length=155)
    tema = models.CharField(max_length=255)
    guestId = models.ForeignKey('User', on_delete=models.CASCADE, related_name='guest')
    owenId = models.ForeignKey('User', on_delete=models.CASCADE, related_name='owner')
    date = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.DurationField()

    def __str__(self):
        return self.title, self.tema, self.guestId, self.owenId, self.date, self.price, self.duration
    
class Propuesta(models.Model):
    userId = models.ForeignKey('User', on_delete=models.CASCADE)
    title = models.CharField(max_length=155)
    tema = models.CharField(max_length=255)
    description = models.TextField()
    initial_price = models.DecimalField(max_digits=10, decimal_places=2)
    state = models.CharField(max_length=50)
    date_available = models.DateTimeField()

    def __str__(self):
        return self.userId, self.description, self.initial_price, self.state, self.date_available
    
    def verificar_expiracion(self):
        argentina_tz = pytz.timezone('America/Argentina/Buenos_Aires')
        now_arg = timezone.now().astimezone(argentina_tz)
        fecha_arg = self.date_available.astimezone(argentina_tz)
        print("fecha habil", self.date_available, " ---- fecha actual", now_arg)
        if self.state == "activo" and fecha_arg < now_arg:
            self.state = "expirado"
            self.save()
        return self.state   


    
class ContraOferta(models.Model):
    clase = models.ForeignKey(Clase, on_delete=models.CASCADE)
    userId = models.IntegerField()
    new_price = models.DecimalField(max_digits=10, decimal_places=2)
    date_available = models.DateTimeField()

    def __str__(self):
        return self.clase, self.userId, self.new_price, self.date_available
    
class User(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField()
    birth_date = models.DateField()
    description = models.TextField()
    horary = models.JSONField()

    def __str__(self):
        return self.name, self.surname, self.email, self.birth_date, self.description, self.horary
    


