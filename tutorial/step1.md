# Step 1: Set up the basic Django project structure
We will start by installing requirements and setting up the project. If you already did that, continue with [Step 2](step2.md).

## Installing requirements and setting up the virtual environment
Create a virtual environment ([http://TODO](click here) to learn more about virtual environments) and install requirements
```bash
mkdir django-rest-imageupload-example
cd django-rest-imageupload-example
virtualenv -p python3.4 venv # create a virtual python environment
source venv/bin/activate # activate the virtual environment
pip install django djangorestframework markdown django-filter Pillow # install requirements
```

For [Pillow](https://python-pillow.org/) (a third party library for image uploads in Django) to work properly, you need to install some 
extra tools (mainly libjpeg and zlib). See [this site](http://pillow.readthedocs.io/en/3.1.x/installation.html#building-on-linux) for details.

## Creating our Django Project
Create the Django project by executing the following command in a shell:
```bash
django-admin startproject django_rest_imageupload_backend
```

Now open the main folder `django-rest-imageupload-example` as a project in an editor of your choice
(we recommend the [PyCharm community edition](https://www.jetbrains.com/pycharm/download/#section=linux)). 
You should see the following project structure:

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
telling you that you that _It worked!_. However, Django comes with a handy [admin panel](https://docs.djangoproject.com/en/1.10/ref/contrib/admin/), which you can 
access by going to [http://127.0.0.1:8000/admin/](). Before you do that, you will have to create a superuser. Django
has packed this process in another command:
```bash
python manage.py createsuperuser
```
Enter a username and a password. You can leave the e-mail blank for now. Once this is done, you should be able to use
those credentials to log in into the admin panel, which will provide the following two sections (for now): `Groups` and 
`Users`. 

