# Step 8: Deleting an uploaded image
We already have the hardest part, [uploading an image](step7.md) out of the way. Deleting an 
image is straightforward. 

## Add a delete button
First we are adding a delete button in our `index.html` view:
```HTML
    <div ng-repeat="image in images track by image.pk">
        <h3>Image {{ image.pk }}</h3>
        <a href="{{ image.image }}">{{ image.image }}</a><br />
        <a ng-click="deleteImage(image)">!! Delete</a><br />
        <img ng-src="{{ image.image }}" width="800">
    </div>
```

## Add the deleteImage method in MainCtrl
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


Refresh the page in your browser and try deleting images. 

This page does not look very fancy, in fact, it's ugly. We are going to change this in [Step 9](step9.html) by adding the Bootstrap CSS theme.