import uuid
from django.db import models


# scramble/uglify the filename of the uploaded file, keep the file extension though
def scramble_uploaded_filename(instance, filename):
    extension = filename.split(".")[-1]
    return "{}.{}".format(uuid.uuid4(), extension)


# UploadedImage Model
# provides an ImageField, where the filename is scrambled by scramble_uploaded_filename
class UploadedImage(models.Model):
    image = models.ImageField("Uploaded image", upload_to=scramble_uploaded_filename)

