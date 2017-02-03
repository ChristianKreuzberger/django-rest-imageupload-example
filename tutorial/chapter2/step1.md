# Automatically Creating the Thumbnail in the Django Model

Serving thumbnails, scaled-down versions of the uploaded images, can be accomplished by multiple ways, for instance:

 * Create thumbnails on the fly when they are requested (can be done, but will need an intelligent caching logic)
 * Create thumbnails when the original image has been uploaded
 * Create thumbnails using a cron job
 * A mix of all three
 
Regardless of your choice you should *always* store the original image. This is done to avoid issues in the future, 
for instance when you decide that it is time to increase the thumbnail size, or you want to apply some filters to the 
original image. 

For this tutorial, we chose to create thumbnails when the original image is being uploaded, therefore we need to adapt 
our Django model. 

## Adding Another ImageField 
First we need to adapt our database schema. Therefore open `imageupload/models.py` and edit the `UploadedImage` 
model as follows:
```python
class UploadedImage(models.Model):
    image = models.ImageField("Uploaded image", upload_to=scramble_uploaded_filename)
    thumbnail = models.ImageField("Thumbnail of uploaded image", blank=True)

```
Here we create a new column called `thumbnail` of type ImageField, which may be blank (for now).

## Migrating the Data
Immediately after adding this field we need to migrate changes to our database:
```bash
python manage.py makemigrations # create migrations 
python manage.py migrate # apply migrations
```

The first command creates a new migration in `imageupload/migrations/` (e.g., `0003_uploadedimage_thumbnail.py`), 
while the second command executes the migration. This creates the column in our database and we can now test the
model via the admin panel. 

## Creating a Thumbnail
Just naming the column `thumbnail` will obviously not create a thumbnail. We have to implement our thumbnail logic, and
we will do that in the `save` method of the model.

Open `imageupload/models.py` and edit the `UploadedImage` model by creating the `save` method:
```python
class UploadedImage(models.Model):
    ... 
    
    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):        
        super(UploadedImage, self).save()
```

This method will be called every time a new or an existing ``UploadedImage``-object is to be stored in the database. 
The current instance of ``UploadedImage`` is made available in ``self``, therefore we are able to create a method that reads `self.ìmage`,
scales it to a thumbnail, and stores it in `self.thumbnail`. First we are going to create a function in 
`imageupload/models.py` for scaling the image using `pil`:
```python
from PIL import Image

# creates a thumbnail of an existing image
def create_thumbnail(input_image, thumbnail_size=(256, 256)):
    # make sure an image has been set
    if not input_image or input_image == "":
        return

    # open image
    image = Image.open(input_image)

    # use PILs thumbnail method; use anti aliasing to make the scaled picture look good
    image.thumbnail(thumbnail_size, Image.ANTIALIAS)

    # parse the filename and scramble it
    filename = scramble_uploaded_filename(None, os.path.basename(input_image.name))
    arrdata = filename.split(".")
    # extension is in the last element, pop it
    extension = arrdata.pop()
    basename = "".join(arrdata)
    # add _thumb to the filename
    new_filename = basename + "_thumb." + extension

    # save the image in MEDIA_ROOT and return the filename
    image.save(os.path.join(settings.MEDIA_ROOT, new_filename))

    return new_filename

```

This function can now be called in our `save` method as follows:
```python
class UploadedImage(models.Model):
    ...

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        # generate and set thumbnail or none
        self.thumbnail = create_thumbnail(self.image)

        super(UploadedImage, self).save()
```

We can now test this by going to the Django Admin Panel and creating a new image. A thumbnail 
should automatically be created.
