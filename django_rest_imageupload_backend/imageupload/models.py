import os
import uuid

from PIL import Image
from django.db import models
from django.conf import settings


# scramble/uglify the filename of the uploaded file, keep the file extension though
def scramble_uploaded_filename(instance, filename):
    extension = filename.split(".")[-1]
    return "{}.{}".format(uuid.uuid4(), extension)


# creates a thumbnail of an existing image
def create_thumbnail(input_image, thumbnail_size=(256, 256)):
    # check if image has been set
    if not input_image or input_image == "":
        return

    # open image
    image = Image.open(input_image)

    # use PILs thumbnail method; use anti aliasing to make the scaled picture looks "okay"
    image.thumbnail(thumbnail_size, Image.ANTIALIAS)

    # parse the filename and scramble it
    filename = scramble_uploaded_filename(None, os.path.basename(input_image.name))
    arrdata = filename.split(".")
    # extension is in the last element, pop it
    extension = arrdata.pop()
    basename = "".join(arrdata)
    # add _thumb to the filename
    new_filename = basename + "_thumb." + extension

    # save the image in MEDIA_ROOT and return the filename
    image.save(os.path.join(settings.MEDIA_ROOT, new_filename))

    return new_filename


# UploadedImage Model
# provides an ImageField, where the filename is scrambled by scramble_uploaded_filename
class UploadedImage(models.Model):
    image = models.ImageField("Uploaded image", upload_to=scramble_uploaded_filename)

    # thumbnail
    thumbnail = models.ImageField("Thumbnail of uploaded image", blank=True)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        # generate and set thumbnail or none
        self.thumbnail = create_thumbnail(self.image)

        # Check if a pk has been set, meaning that we are not creating a new image, but updateing an existing one
        if self.pk:
            force_update = True

        # force update as we just changed something
        super(UploadedImage, self).save(force_update=force_update)

