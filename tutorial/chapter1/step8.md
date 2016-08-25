# Step 8: Deleting an Uploaded Image
While uploading a new image was quite some work, deleting it is rather easy.

## Add a Delete Button in the View
First we are adding a delete button in our view `static/index.html` for each image:
```HTML
<!-- Main Division -->
<div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
    ...
    <div ng-repeat="image in images track by image.pk">
        <h3>Image {{ image.pk }}</h3>
        <a href="{{ image.image }}">{{ image.image }}</a><br />
        <a ng-click="deleteImage(image)">!! Delete</a><br />
        <img ng-src="{{ image.image }}" width="800">
    </div>
    ...
</div>
```

## Add the deleteImage Method in MainCtrl
Second we add a delete method (which is called on `ng-click` on the delete button):
```JavaScript

myApp.controller('MainCtrl', function($scope, Images)
{
    ...

    $scope.deleteImage = function(image)
    {
        image.$delete(
            function(response)
            {
                // success delete
                console.log('Deleted it');
                // update $scope.images
                $scope.images = Images.query();
            },
            function(rejection)
            {
                console.log('Failed to delete image');
                console.log(rejection);
            }
        );
    };
});
```
If `delete` is successful, we refresh the images array, else we log an error message.


Refresh the page in your browser and try deleting images. 