from django.utils import timezone
import pytz
from django.db import models


class Clase(models.Model):
    title = models.CharField(max_length=155)
    tema = models.CharField(max_length=255)
    guestId = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='guest')
    ownerId = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='owner')
    date = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.DurationField()

    def __str__(self):
        return self.title, self.tema, self.guestId, self.ownerId, self.date, self.price, self.duration


class Propuesta(models.Model):
    userId = models.ForeignKey('User', on_delete=models.CASCADE)
    title = models.CharField(max_length=155)
    tema = models.CharField(max_length=255)
    description = models.TextField()
    initial_price = models.DecimalField(max_digits=10, decimal_places=2)
    state = models.CharField(max_length=50)
    date_available = models.DateTimeField()
    duration = models.DurationField()

    def __str__(self):
        return self.userId, self.description, self.initial_price, self.state, self.date_available

    def verificar_expiracion(self):
        argentina_tz = pytz.timezone('America/Argentina/Buenos_Aires')
        now_arg = timezone.now().astimezone(argentina_tz)
        fecha_arg = self.date_available.astimezone(argentina_tz)
        """print("fecha habil", self.date_available,
              " ---- fecha actual", now_arg)"""
        if self.state == "pendiente" and fecha_arg < now_arg:
            self.state = "expirado"
            self.save()
        return self.state


class ContraOferta(models.Model):
    propuestaId = models.ForeignKey(
        Propuesta, on_delete=models.CASCADE, related_name='propuesta')
    userId = models.IntegerField()
    new_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    state = models.CharField(max_length=50)
    duration = models.DurationField()
    date_available = models.DateTimeField()

    def __str__(self):
        return self.propuestaId, self.userId, self.new_price, self.date_available


class User(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField()
    birth_date = models.DateField()
    description = models.TextField()
    horary = models.JSONField()

    def __str__(self):
        return self.name, self.surname, self.email, self.birth_date, self.description, self.horary


class Pago(models.Model):
    price = models.DecimalField(max_digits=10, decimal_places=2)
    pagadorId = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='pagador')
    beneficiarioId = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='beneficiario')
    claseId = models.ForeignKey(Clase, on_delete=models.CASCADE)

    def __str__(self):
        return self.price, self.pagadorId, self.beneficiarioId, self.claseId


class Calificacion(models.Model):
    calificadoId = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='calificado')
    calificadorId = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='calificador')
    claseId = models.ForeignKey(Clase, on_delete=models.CASCADE)
    calificacion = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.calificadoId, self.calificadorId, self.claseId, self.calificacion, self.date


class Reseña(models.Model):
    reseñadoId = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='reseñado')
    reseñadorId = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='reseñador')
    reseña = models.TextField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.reseñadoId, self.reseñadorId, self.reseña, self.date


class Queja(models.Model):
    queja = models.TextField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.queja, self.date
