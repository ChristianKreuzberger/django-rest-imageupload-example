# Step 4: Uglify/scramble image names on upload to avoid duplicates

One of the problems of the current implementation of our application is that uploaded images are stored
with their cleartext name. This has two problems:
 
 1. We are exposing the original filename, something that might not necessarily be appreciated (think about filenames like sexy.png)
 1. We do not provide a way to handle duplicate filenames
 
Django handles the second part automatically (you can try it out), though for the first part we will have to intervene and tell Django what to do.
While this sounds like something that could be done in the REST endpoint, Django offers methods to do this in the model [imageupload/models.py](django_rest_imageupload_backend/imageupload/models.py):
```python
import uuid
from django.db import models


def scramble_uploaded_filename(instance, filename):
    return "{}_{}".format(uuid.uuid4(), filename)

# Create your models here.
class UploadedImage(models.Model):
    image = models.ImageField("Uploaded image", upload_to=scramble_uploaded_filename)

```

All we need to do is specify the `upload_to` attribute on ImageField and provide a method that creates a random string for us. 
Here we make use of Pythons [uuid](https://docs.python.org/3/library/uuid.html) module, which creates unique identifiers for us.
However, in this simple method `scramble_uploaded_filename` we do not remove the actual filename, which was one of the requirements
we wanted to fulfill. To achieve this, we need to parse the incoming filename and extract the filenames extension:
```python
def scramble_uploaded_filename(instance, filename):
    extension = filename.split(".")[-1]
    return "{}.{}".format(uuid.uuid4(), extension)
```

Although we did not actually change the model, Django requires migrations to be ran again:
```bash
python manage.py makemigrations
```
The migration is placed in `imageupload/migrations/0002_auto_DATE_TIME.py`, though I like to rename migrations to 
something that makes more sense to me than _auto_: ``0002_scramble_uploaded_filename_DATE_TIME.py``
Run migrations using ``python manage.py migrate`` and then try uploading a file using the browsable REST API.
You will see that the uploaded file now has a cryptic name. Conveniently, Django takes care about (the) rest.
