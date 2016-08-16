# Django REST Image Upload Example

## How to re-produce this app
Create a virtual environment ([http://TODO](click here) to learn more about virtual environments) and install requirements
```bash
mkdir django-rest-imageupload-example
cd django-rest-imageupload-example
virtualenv -p python3.4 venv # create a virtual python environment
source venv/bin/activate # activate the virtual environment
pip install django djangorestframework markdown django-filter Pillow # install requirements
```

For [http://TODO](Pillow) (a third party library for image uploads in Django) to work properly, you need to install some 
extra tools (mainly libjpeg and zlib). See 
[http://pillow.readthedocs.io/en/3.1.x/installation.html#building-on-linux](this site) for details.

Create the django project
```bash
django-admin startproject django_rest_imageupload_backend
```

Open the main folder `django-rest-imageupload-example` as a project in Pycharm. You should see the following project
structure:

 * `django-rest-imageupload-example`
     * `django_rest_imageupload_backend`
         * `django_rest_imageupload_backend`
         * `manage.py`
     * `venv`

Note that the virtualenv (in the `venv` folder) has already been determined to be the Python interpreter of choice.

Out of my personal preference, I rename the place where the main configuration of the app resides (currently
`django_rest_imageupload_backend`) to something more generic like `backend_app`. This can either be done manually, 
by renaming the folder and replacing all occurences of `django_rest_imageupload_backend` with `backend_app`, or using
PyCharms _Refactor/Rename_ utility.

You should now have the following directory structure:

 * `django-rest-imageupload-example`
     * `django_rest_imageupload_backend`
         * `backend_app`
         * `manage.py`
     * `venv`


While doing the python stuff it does make sense to define `django-rest-imageupload-example` directory
as the sources root in PyCharm, by right-clicking it and selecting _Mark directory as_ and _Sources root_.


Moving forward, we will tell PyCharm how to run this project (you can skip this step if you want):
 
 1. Open the run configuration on the top right of the window
 1. Create a new Python configuration
 1. As a script, select the `manage.py` created by django in `django-rest-imageupload-example/django_rest_imageupload_backend/`
 1. Insert `runserver` as _Script parameters_ 
 1. The current working directory should have been determiend automatically to be `django-rest-imageupload-example/django_rest_imageupload_backend` without the trailing slash
 1. The python interpreter should be Python 3.4 in your virtual environment `venv`
 1. Give the run configuration a good name (e.g., *Django Run Server*) 
 1. Optional, but recommended: Make a tick at _Single instance only_, avoiding the django server to be ran more than once
 1. Hit apply button 8save it)
 1. Run it
 
Alternatively, you can just run the following command from shell (assuming that you are in the main folder of this project)
```bash
cd django_rest_imageupload_backend
python manage.py runserver
```

If everything went according to our plans, you should the following message (either in PyCharm or in a shell):
```
Performing system checks...

System check identified no issues (0 silenced).

You have 13 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
August 16, 2016 - 17:02:53
Django version 1.10, using settings 'backend_app.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```


Looks like we have 13 unapplied [http://TODO](migrations)! Let's quickly fix them by running the following command in a shell:
```bash
python manage.py migrate
```


You can try to access [http://127.0.0.1.8000]() in a browser, but you will not be able to see much, except for a message
telling you that you that _It worked!_. However, Django comes with a handy [http://TODO](admin panel), which you can 
access by going to [http://127.0.0.1:8000/admin/](). Before you do that, you will have to create a superuser. Django
has packed this process in another command:
```bash
python manage.py createsuperuser
```
Enter a username and a password. You can leave the e-mail blank for now. Once this is done, you should be able to use
those credentials to log in into the admin panel, which will provide the following two sections (for now): `Groups` and 
`Users`. 


Now that we have the basics for django out of the way, we can create our image upload application. First of all, we need
to create a django app that will represent our database model and some basic logic:
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
 
In the fresh `imageupload` the model needs to be created in [django-rest-imageupload-example/django_rest_imageupload_backend/imageupload/models.py](models.py)
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


So far we have only created the model and tested uploading some images via the admin panel. However, the core of this project is not 
going to be the admin panel, but the REST endpoint. Therefore we will create a new app called `imageupload_rest`:
```bash
python manage.py startapp imageupload_rest
```

The directory structure should now look like this:
 * `django-rest-imageupload-example`
     * `django_rest_imageupload_backend`
         * `backend_app`
         * `imageupload`
         * `imageupload_rest`
         * `manage.py`
     * `venv`

Make sure to add `imageupload_rest` as well as `rest_framework` in [django-rest-imageupload-example/django_rest_imageupload_backend/backend_app/settings.py](settings.py):
```python
INSTALLED_APPS = [
    ...
    'rest_framework',    
    ...
    'imageupload_rest',
    ...
]
```

I like to keep my projects clean and minimalistic. Therefore I choose to get rid of the following files/folders:

 * `imageupload_rest/admin.py`
 * `imageupload_rest/models.py`
 * `imageupload_rest/migrations/`
 * `imageupload_rest/views.py`
 
However, we will need a way of defining URLs, therefore we create a `imageupload_rest/urls.py` with the following content:
```python
from django.conf.urls import url, include
from rest_framework import routers

router = routers.DefaultRouter()

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
]

```

Last but not least, we have to link the new `urls.py` with the existing `backend_app/urls.py`:
```python
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('imageupload_rest.urls', namespace='api')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

```
This should be enough for us to see the entry point for the browsable API at [http://127.0.0.1:8000/api/]().

Django Rest Framework  Apps are organized as follows:

 * `urls.py` provide the routing, similar to what you would do for a normal django app
 * `viewsets.py` (needs to be created) provide the API views and logic, similar to what you would do in `views.py` of a normal django app
 * `serializers.py` (needs to be created) define how certain models should be linked together and serialized 

We will start by creating a serializer for our `UploadedImage` model in 
[django-rest-imageupload-example/django_rest_imageupload_backend/imageupload_rest/serializers.py](imageupload_rest/serializers.py):
```python
from rest_framework import serializers
from imageupload.models import UploadedImage


class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ('pk', 'image', )
        
```
This serializer tells the DRF engine to serialize the fields `pk` and `image` of our model `UploadedImage`.
 
The corresponding viewset is also not very difficult to write 
[django-rest-imageupload-example/django_rest_imageupload_backend/imageupload_rest/viewsets.py](imageupload_rest/viewsets.py):
```python
from rest_framework import viewsets, filters
from imageupload_rest import serializers
from imageupload.models import UploadedImage


class UploadedImagesViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all()
    serializer_class = serializers.UploadedImageSerializer

```
We define the django queryset which should be used for serving the data from the database to the REST endpoint
(in this case we serve all pictures), as well as the serializer class (the class we just created).

Last but not least, we need to tell the router in `urls.py` that there is a new endpoint which should be served
under the `/api/images` endpoint:
```python
from django.conf.urls import url, include
from rest_framework import routers
from imageupload_rest import viewsets

router = routers.DefaultRouter()
router.register('images', viewsets.UploadedImagesViewSet, 'images')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
]

```

Now refresh the [http://127.0.0.1:8000/api/](browsable API site) in your browser and the new `images` endpoint should
appear. By clicking on the link for this new endpoint you should be able to a list of existing images, ready to
be displayed a (still to be written) frontend application. In addition, the browsable API lets you upload new images
and delete existing images (e.g., by accessing [http://127.0.0.1:8000/api/images/1/]() in your browser and clicking on delete).





[django-tutorial]: https://docs.djangoproject.com/en/1.10/intro/tutorial01/
