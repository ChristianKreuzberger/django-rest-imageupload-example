# Step 5: Prepare the Frontend Application

In this tutorial, the frontend application will be created inside our Django App. This allows us to 
run the Django server only once and have everything ready to go (frontend and backend). If you want, 
you can also create this as an independent project, though you will have to properly configure your
webserver and/or application so that communication between those two is allowed.

For this tutorial, which is served by a git repository, it makes sense to bundle frontend and backend.
 
## Create the Frontend Application inside Django
Yep, another app.
```bash
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

Same as before, I like to remove unneeded code, therefore we are going to delete the following files 
inside this app:

 * `imageupload_frontend/migrations/`
 * `imageupload_frontend/admin.py`
 * `imageupload_frontend/apps.py`
 * `imageupload_frontend/models.py`

I am leaving the `tests.py` file on purpose, even though this is a frontend application.
 
In addition, we are going to create `imageupload_frontend/urls.py` with a command that routes the root URL of our project to
a static index.html (which we still have to create):
```python
from django.conf.urls import url, include
from django.views.generic.base import RedirectView

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r'^$', RedirectView.as_view(url='static/index.html', permanent=False), name='index')
]

```
This will make Django redirect any request coming to root URL [http://127.0.0.1/] of our application (or server) 
to `static/index.html`. At this point we should probably create a folder `imageupload_frontend/static` with a file `index.html` in it. 
For now, just put some text into `index.html` (e.g., Hello World).

## Configuration
Back to `backend_app` (yes, the name is a little bit misleading now...). First we need to tell Django that `imageupload_frontend` needs to be loaded. 
To do this, open `backend_app/settings.py` and add `imageupload_frontned` to
`INSTALLED_APPS`:
```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    ...
    'imageupload',
    'imageupload_rest',
    'imageupload_frontend',
    ...
]
```

We also need to edit `backend_app/urls.py` and tell Django that all requests to the root of our server need to be handled
by the url configuration of our frontend application `imageupload_frontend/urls.py`, by adding 
```python
    url(r'^', include('imageupload_frontend.urls', namespace='frontend')),
```
The resulting `backend_app/urls.py` should look like this:
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

You can now access [http://127.0.0.1:8000/] and you should be redirected to `static/index.html` and see the `Hello World` message (or whatever you wrote into index.html).
