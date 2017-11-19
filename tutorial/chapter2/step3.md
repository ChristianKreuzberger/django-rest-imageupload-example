# Adding a Title and Description to each Image

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

In addition, we should always provide a `__str__` method for every model. Now that our model contains a string, we
can return the title of the image:
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
        read_only_fields = ('thumbnail',)

```

You can now go to the browsable API and see the changes immediately.


## Update the Frontend
Displaying the title and description is easy. Open `imageupload_frontend/static/index.html` and edit 
the part where the image is displayed as follows:
```HTML
<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4" ng-repeat="image in images track by image.pk">
        <h3>
            {{ image.title }}
            <button class="btn btn-warning" ng-click="deleteImage(image)">Delete</button>
        </h3>
        <a href="{{ image.image }}">
            <img class="img-responsive" ng-src="{{ image.thumbnail }}">
            <p>{{ image.description }}</p>
        </a>
    </div>
</div>
```

Last but not least, we have to add two input fields to the `Upload` form in `imageupload_frontend/static/index.html`:
```HTML
    <div class="panel panel-default">
        <div class="panel-body">
            <form class="form" name="form" ng-submit="uploadImage()">
                <label for="inputFile">Select Image:</label>
                <input id="inputFile" type="file" files-model="newImage.image">
                <br />
                <label for="title">Title</label>
                <input type="text" id="title" ng-model="newImage.title"><br />

                <label for="description">Description</label>
                <textarea id="description" ng-model="newImage.description"></textarea><br />
                <button class="btn btn-primary" type="submit">
                    Upload
                </button>
            </form>
        </div>
    </div>
```

However, this looks a little weird. We can make this look a lot better by wrapping ``<div class="form-group">`` around our
labels input fields, and applying ``class="form-control"`` to the input fields:
```HTML
    <div class="panel panel-default">
        <div class="panel-body">
            <form class="form" name="form" ng-submit="uploadImage()">
                <div class="form-group">
                    <label for="inputFile">Select Image:</label>
                    <input id="inputFile" class="form-control" type="file" files-model="newImage.image">
                </div>
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" class="form-control" id="title" ng-model="newImage.title">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" class="form-control" ng-model="newImage.description"></textarea>
                </div>
                <button class="btn btn-primary" type="submit">
                    Upload
                </button>
            </form>
        </div>
    </div>
```

That's it! You can now go to the website and enter a title and description before uploading an image!
