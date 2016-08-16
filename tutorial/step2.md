# Step 2: Create the `UploadedImage` model and migrations
Now that we have the basics for django out of the way, we can create our image upload application. 
If you already did that, continue with [step3.md](Step 3).

First of all, we need to create a django app that will represent our database model and some basic logic:
```bash
python manage.py startapp imageupload
```
The directory structure should now look like this:
 * `django-rest-imageupload-example`
     * `django_rest_imageupload_backend`
         * `backend_app`
         * `imageupload`
         * `manage.py`
     * `venv`
 
In the fresh `imageupload` the model needs to be created in 
[django-rest-imageupload-example/django_rest_imageupload_backend/imageupload/models.py](models.py)
as follows (using Djangos `ImageField`):
```python
from django.db import models


# Create your models here.
class UploadedImage(models.Model):
    image = models.ImageField("Uploaded image")
```

Furthermore, we need to include the new `imageupload` app and also define `MEDIA_ROOT` aswell as `MEDIA_URL` in [django-rest-imageupload-example/django_rest_imageupload_backend/backend_app/settings.py](settings.py):
```bash

INSTALLED_APPS = [
    ...
    'imageupload',
    ...
]

...

MEDIA_ROOT = os.path.join(BASE_DIR, '..', 'uploaded_media')
MEDIA_URL = '/media/'
```
Please note that we have set the `MEDIA_ROOT` to be outside of the django root directory on purpose


We can now proceed by creating the database migrations based on our new model:
```bash
python manage.py makemigrations
```
and also executing them in our local database:
```bash
python manage.py migrate
```

Finally we want this new model to appear on the Django admin panel, therefore we edit [django-rest-imageupload-example/django_rest_imageupload_backend/imageupload/admin.py](admin.py)
as follows:
```python
from django.contrib import admin
from imageupload.models import UploadedImage

# Register your models here.
admin.site.register(UploadedImage)
```


After refreshing the admin site in your browser you should see the new `Uploaded Images` model. Try adding any picture using the admin site.
You will quickly find out that uploading the picture is working fine, and it also appears in the `uploaded_media/` folder, but you can not
access it. This is because 
[https://docs.djangoproject.com/en/1.10/howto/static-files/#serving-files-uploaded-by-a-user-during-development](Django does not serve the media files by default) (and you should not do this in a production setup either). 

To overcome this problem we edit [django-rest-imageupload-example/django_rest_imageupload_backend/backend_app/urls.py](backend_app/urls.py) 
as follows:
```python
from django.conf.urls import url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

```


