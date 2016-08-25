# Step 5: Prepare the frontend application

In this tutorial, the frontend application will be created inside our Django App. This allows us to 
run the Django server only once and have everything ready to go (frontend and backend). If you want, 
you can also create this as an independent project, though you will have to properly configure your
webserver and/or application so that communication between those two is allowed.
 
## Create the frontend application inside Django
```bash
cd django-rest_imageupload_backend
python manage.py startapp imageupload_frontend
```

Your directory structure should now look as follows:

 * `django-rest-imageupload-example`
     * `django_rest_imageupload_backend`
         * `backend_app`
         * `imageupload`
         * `imageupload_frontend`
         * `imageupload_rest`
         * `manage.py`
     * `venv`

As seen before, I like to remove unneeded code, therefore we are going to delete the following files 
inside this app:

 * migrations/
 * admin.py
 * apps.py
 * models.py
 * tests.py
 
In addition, we are going to create `urls.py` with the following content:
```python
from django.conf.urls import url, include
from django.views.generic.base import RedirectView

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r'^$', RedirectView.as_view(url='static/index.html', permanent=False), name='index')
]

```
This will make Django redirect any request coming to the main page of our server to `static/index.html`. At this point we also need to create a folder called `static` with a file `index.html`. For now, just put some text into 
`index.html` (e.g., Hello World).

## Link the frontend application
Now it is time to tell the main Django app that we have a new frontend application. First we need to tell DJango that 
`imageupload_frontend` needs to be loaded. To do this, open `backend_app/settings.py` and add `imageupload_frontned` to
`INSTALLED_APPS`:
```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'imageupload',
    'imageupload_rest',
    'imageupload_frontend',
    ...
]
```

We also need to edit `backend_app/urls.py` and tell Django that all requests to the root of our server need to be handled
by the url configuration of our frontend application:
```
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^', include('imageupload_frontend.urls', namespace='frontend')),
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('imageupload_rest.urls', namespace='api')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

```

You can now access [http://127.0.0.1:8000/] and you should be redirected to `static/index.html` and see the Hello World message.
