# Preview the image before uploading
One of the features that our frontend is missing desperately is a quick preview of the selected image.

## Install  ng-file-upload
As we do not want to reinvent the wheel, we are using ``ng-file-upload`` to accomplish this task.
```bash
cd imageupload_frontend/static/
npm install ng-file-upload
```

Add the following piece of code into the HTML ``<head>`` tag:
```html
    <script src="node_modules/ng-file-upload/dist/ng-file-upload.min.js"></script>
```
And include ``ngFileUpload`` as a dependency in your angular module.
```javascript
var myApp = angular.module('imageuploadFrontendApp', ['ngResource', 'ngFileUpload']);
```

## Make use of ngFileUpload in our frontend
Rewrite the input form:
```html
    <div class="panel panel-default">
        <div class="panel-body">
            <form class="form" name="form" ng-submit="uploadImage()">
                <div class="form-group">
                    <label for="file">Select an Image</label>
                    <input type="file" ngf-select ng-model="newImage.image" name="file"
                           class="form-control"
                           accept="image/*" ngf-max-size="10MB" required
                           ngf-model-invalid="errorFile">
                    <i ng-show="form.file.$error.maxSize">File too large
                        {{ errorFile.size / 1000000 | number:1 }} MB: max 10M</i>
                    <img ng-if="form.file.$valid" ngf-thumbnail="newImage.image" class="img-responsive" style="max-width: 50%">
                    <button class="btn btn-warning" ng-click="newImage.image = null" ng-show="newImage.image">Remove</button>
                </div>
                ...
            </form>
        </div>
    </div>
```

## Reset newImage after successful upload
For sanity reasons we should reset ``$scope.newImage`` after a successful upload:
```javascript
    $scope.uploadImage = function()
    {
        // call REST API endpoint
        Images.save($scope.newImage).$promise.then(
            function(response) {
                // the response is a valid image, put it at the front of the images array
                $scope.images.unshift(response);

                // reset newImage
                $scope.newImage = {};
            },
            function(rejection) {
                console.log('Failed to upload image');
                console.log(rejection);
            }
        );
    };
```

## remove filesModelDirective
You probably already noticed that our filesModelDirective is now useless. Therefore we are removing it.

Remove the following line from your index.html:
```html
<script src="js/filesModelDirective.js"></script>
```
And remove the filesModelDirective.js file from your project.
