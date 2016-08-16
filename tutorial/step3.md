# Step 3: Create the basic REST endpoint
So far we have only created the model and tested uploading some images via the admin panel. However, the core of this project is not 
going to be the admin panel, but the REST endpoint. 

## Create the REST app
Create a new Django app called `imageupload_rest`:
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

Make sure to add `imageupload_rest` as well as `rest_framework` in [backend_app/settings.py](django-rest-imageupload-example/django_rest_imageupload_backend/backend_app/settings.py):
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
[imageupload_rest/serializers.py](django-rest-imageupload-example/django_rest_imageupload_backend/imageupload_rest/serializers.py):
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
[imageupload_rest/viewsets.py](django-rest-imageupload-example/django_rest_imageupload_backend/imageupload_rest/viewsets.py):
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
urlpatterns = [
    url(r'^', include(router.urls)),
]

```

Now refresh the [browsable API site](http://127.0.0.1:8000/api/) in your browser and the new `images` endpoint should
appear. By clicking on the link for this new endpoint you should be able to a list of existing images, ready to
be displayed a (still to be written) frontend application. In addition, the browsable API lets you upload new images
and delete existing images (e.g., by accessing [http://127.0.0.1:8000/api/images/1/]() in your browser and clicking on delete).

