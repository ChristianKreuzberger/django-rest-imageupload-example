# Preview the image before uploading
One of the features that our frontend is missing desperately is a quick preview of the selected image.

## Install 
```bash
cd imageupload_frontend/static/
npm install ng-file-upload
```

```html
    <script src="node_modules/ng-file-upload/dist/ng-file-upload.min.js"></script>
```

```javascript
var myApp = angular.module('imageuploadFrontendApp', ['ngResource', 'ngFileUpload']);

```


Rewrite the input form
```html
        <div class="panel panel-default">
            <div class="panel-body">
                <form class="form" name="form" ng-submit="uploadImage()">
                    <div class="form-group">
                        <label for="file">Select an Image:</label>
                        <input type="file" ngf-select ng-model="newImage.image" name="file"
                               class="form-control"
                               accept="image/*" ngf-max-size="10MB" required
                               ngf-model-invalid="errorFile">
                        <i ng-show="form.file.$error.maxSize">File too large
                            {{ errorFile.size / 1000000 | number:1 }} MB: max 10M</i>
                        <img ng-show="form.file.$valid" ngf-thumbnail="newImage.image" class="img-responsive">
                        <button class="btn btn-warning" ng-click="newImage.image = null" ng-show="newImage.image">Remove</button>
                    </div>
                    ...
                </form>
            </div>
        </div>
```