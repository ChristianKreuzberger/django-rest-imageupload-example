# Django REST Image Upload Example
This Django tutorial app was created for the purpose of demonstrating Django and Django Rest Framework. It shows the basics
of writing a REST endpoint which allows uploading and retrieving pictures.

I also wrote a [tutorial](tutorial/README.md), though if you just want to try my code out, I suggest using using the Quick Start 
or the Docker Image below (todo).

Be aware that there are multiple branches, one for each chapter of the tutorial.

There is also a YouTube series about this tutorial:
[https://www.youtube.com/watch?v=hMiNTCIY7dw]()


## Quick Start
Installation Steps if you want to try it out
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

## Contributing and Licence
This repo is using the [MIT licence](LICENSE) and only serves an educational purpose. Feel free to do clone, modify and share this repository.
If you find an error or have questions, feel free to write comments or raise an issue. If you want to contribute, feel free to hand in a 
pull-request.
