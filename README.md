# Django REST Image Upload Example
This Django tutorial app was created for the purpose of demonstrating Django and Django Rest Framework. It shows the basics
of writing a REST endpoint which allows uploading and retrieving pictures.

I also wrote a [tutorial](tutorial/README.md), though if you just want to try my code out, I suggest using using the Quick Start 
or the Docker Image below.

Be aware that there are multiple branches, one for each chapter of the tutorial.

As a warning: The tutorial is very superficial. I will however create a YouTube video about it, which I will link within this repository.

## Quick Start
Obvious Django Installation Steps
```
git clone https://github.com/ChristianKreuzberger/django-rest-imageupload-example.git
cd django-rest-imageupload-example
virtualenv -p python3.4 venv
source venv/bin/activate
pip install -r requirements.txt
cd django_rest_imageupload_backend
python manage.py migrate
python manage.py runserver # starts the server 
```


## Docker Image
ToDo