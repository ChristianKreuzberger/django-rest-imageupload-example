# Adding a Title and Description

We now want to extend the `UploadedImage` model with a title and a description.
Django makes this process very easy, as we only have to add two fields to the
model, and extend the serializers `fields` list.

## Update Model and Migrate Changes
Open `imageupload/models.py` and add the following two fields to the `UploadedImage` model:
```python
    # title and description
    title = models.CharField("Title of the uploaded image", max_length=255, default="Unknown Picture")
    description = models.TextField("Description of the uploaded image", default="")
    
```

In addition, we should now provide a `__str__` method for this model, returning the title of the image.
```python
    def __str__(self):
        return self.title
```

Create the migrations using ``python manage.py makemigrations`` and rename the migration file from
`0004_auto_*_*.py` to `0004_uploadedimage_title_description.py`. Finally, run ``python manage.py migrate``.

You can now go to the django admin page and see the changes immediately.

## Update the REST API
Open `imageupload_rest/serializers.py` and add `'title', 'description'` to the `fields` attribute of `UploadedImageSerializer`:
```python
class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ('pk', 'image', 'thumbnail', 'title', 'description', )

```

You can now go to the browsable API and see the changes immediately.


## Update the Frontend
Now this is the part that involves the most effort. 