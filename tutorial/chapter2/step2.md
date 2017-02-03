# Extending the Backend and the Frontend to provide the Thumbnail

## Backend (REST API)
Now that our model has a thumbnail, we can tell our REST API to provide the `thumbnail` field by 
editing `imageupload_rest/serializers.py` and adding the `thumbnail` field to the `fields` list
as follows:

```python
class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ('pk', 'image', 'thumbnail',)

```

That's it! Django Rest Framework takes care of the rest.

## Frontend
Ofcourse we need to make sure our frontend now uses `thumbnail` instead of image. Therefore we need to 
edit `imageupload_frontend/static/index.html` and replace
```HTML
<img class="img-responsive" ng-src="{{ image.image }}">
```
with
```HTML
<img class="img-responsive" ng-src="{{ image.thumbnail }}">
```

We now have thumbnails in our little app.

## Back to the REST API
While everything seems to be working fine, there is one small problem: It is now possible to overwrite the thumbnail
via the REST API. 

To prevent this, we need to tell the ``UploadedImageSerializer`` that ``thumbnail`` is not writeable:
```python
class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ('pk', 'image', 'thumbnail',)
        read_only_fields = ('thumbnail', )

```
