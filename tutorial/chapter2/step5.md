# Fixing the flickering when deleting images
By now you probably noticed that the page is flickering briefly when deleting an image, displaying the message ``There are no images available yet.``.
This is due to the fact that we reload the list of images from the REST API after deleting an image:

```javascript
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

1. We do not have to query the REST API after we delete an image. This causes additional load to the server.
1. We should never assign the result of a ``$resource`` query directly to a variable we want to display like this: 
``$scope.images = Images.query();``

## Deleting the image from the local images list using splice
JavaScripts splice method allows us to remove elements from an array by using an index and a length. Therefore we only
have to locate the element in question (by using ``indexOf``) and then call splice with said index. It's important to 
know that the return value of splice only contains the deleted elements, but not the remaining elements. Therefore 
assigning the returned value to our images array would be wrong!
```javascript
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
                var idx = $scope.images.indexOf(image);
                if (idx < 0) {
                    console.log('Error: Could not find image');
                } else {
                    $scope.images.splice(idx, 1);
                }
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


## Alternative: Using $promise when reloading images
If you really have to reload images from the API, you can do it the following way:
```javascript
Images.query().$promise.then(
    function success(response) {
        $scope.images = response;
    }
);
```
There is a profound difference in doing this instead of ``$scope.images = Images.query();``. The ``query()`` method
returns a ``$promise`` object, instead of an array. The time needed for the REST API to provide a response is enough
for Angular to re-render the page, and when we assign this promise to ``$scope.images``, we will see the images flicker
for a very short time. 

```javascript
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
                Images.query().$promise.then(
                    function success(response) {
                        $scope.images = response;
                    }
                );
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

### Best Practice: Write a wrapper method for querying the API
Pro Tip: Wrap your loading method in another function, and store some info that you are loading images with a boolean.
```javascript
    /**
     * An array containing all the images shown on the page
     * @type {Array}
     */
    $scope.images = [];
    
    /**
     * Indicating whether images are being loaded or not
     * @type {boolean}
     */
    $scope.imagesLoading = false;
    
    /**
     * Load images from API
     * @returns {*}
     */
    $scope.loadImages = function() {
        $scope.imagesLoading = true;
        
        return Images.query().$promise.then(
            // on success
            function success(response) {
                // store response
                $scope.images = response;
                // loading has finished
                $scope.imagesLoading = false;
                return response;
            },
            // on error
            function error(rejection) {
                // log the error to console
                console.log(rejection);
                // loading has finished (although with an error)
                $scope.imagesLoading = false;
                return rejection;
            }
        );
    };
```
