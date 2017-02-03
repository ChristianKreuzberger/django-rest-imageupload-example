# Fixing the flickering when deleting images
By now you probably noticed that the page is flickering briefly when deleting an image, displaying the message ``There are no images available yet.``.
This is due to the fact that we reload the list of images from the REST API after deleting an image:

```javascript
    /**
     * Delete an image on Button Press
    */
    $scope.deleteImage = function(image)
    {
        // call REST API endpoint
        image.$delete(
            // process response of delete
            function(response)
            {
                // success delete
                console.log('Deleted it');
                // update $scope.images
                $scope.images = Images.query();
            },
            function(rejection)
            {
                // failed to delete it
                console.log('Failed to delete image');
                console.log(rejection);
            }
        );
    };
```

Two things are wrong with this code:

1. We should never assign the result of a ``$resource`` query directly to a variable we want to display: ``$scope.images = Images.query();``
1. We should not have to query the REST API after we delete an image. This causes additional load to the server that can be avoided.

## Deleting the image from the local images list

## Using $promise and providing an indicator that images are being loaded

