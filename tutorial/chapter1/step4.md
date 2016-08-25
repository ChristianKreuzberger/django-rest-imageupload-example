# Step 4: Uglify/scramble Image names on Upload to Avoid Duplicates

One of the problems of the current implementation of our REST endpoint is that uploaded images are stored
with their cleartext name. This has two problems:
 
 1. We are exposing the original filename, something that might not necessarily be appreciated by your users (think about filenames like topsecret.png or sexy.png)
 1. We do not provide a way to handle duplicate filenames
 
Django handles the second part automatically (you can try it out by uploading the same picture multiple times), 
though for the first part we will have to intervene and tell Django what to do.

While this sounds like something that could be done in the REST endpoint, Django offers methods to 
do this in the model definition. This has the benefit of being available transparently to anyone using the `UploadedImage` model.

## Editing the model
We can achieve this by creating a function `scramble_uploaded_filename` and setting the `upload_to` attribute of `ImageField` in 
`imageupload/models.py` as follows:
```python
import uuid
from django.db import models


def scramble_uploaded_filename(instance, filename):
    extension = filename.split(".")[-1]
    return "{}.{}".format(uuid.uuid4(), extension)


class UploadedImage(models.Model):
    image = models.ImageField("Uploaded image", upload_to=scramble_uploaded_filename)

```

By setting the `upload_to` attribute on `ImageField` with a method that creates a random string (by using `uuid.uuid4()`) we achieve the desired behaviour of randomizing the file name. 
Here we make use of Pythons [uuid](https://docs.python.org/3/library/uuid.html) module, which creates _unique identifiers_ for us.
In addition, we parse the filename and get the extension of the file (e.g., `.jpg`) which we concat to the unique identifier.

## Migrations
What?!? We did not actually change the model, but Django requires us to run migrations again:
```bash
python manage.py makemigrations
```
The migration is placed in `imageupload/migrations/0002_auto_{DATE}_{TIME}.py`, though I like to rename migrations to 
something that makes more sense to me than _auto_: ``0002_scramble_uploaded_filename_{DATE}_{TIME}.py``.

Finally, run migrations using ``python manage.py migrate`` and you should see the following message:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, imageupload, sessions
Running migrations:
  Rendering model states... DONE
  Applying imageupload.0002_scramble_uploaded_filename_{DATE}_{TIME}... OK

```

Try uploading a file now using the browsable REST API. You will see that the uploaded file 
automagically has a cryptic name. Everything else is handled by Django.