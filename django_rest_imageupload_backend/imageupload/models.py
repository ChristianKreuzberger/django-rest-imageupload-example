from django.db import models


# Create your models here.
class UploadedImage(models.Model):
    image = models.ImageField("Uploaded image")