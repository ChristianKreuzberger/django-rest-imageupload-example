# Step 7: Uploading Images using AngularJS
So far we have created a basic page that lists all our images. Now it is time to upload images.

## Calling Images.save() - or maybe not ...
We already defined our REST endpoint in `static/js/images.rest.js` which provides us with all the methods we need. At least in theory. 
In practice, there seem to be [several problems](http://stackoverflow.com/a/21115779) with uploading images, which can be solved
using a `FormData` object in our REST endpoint in JavaScript.

First, we need to define a `transform` method in `static/js/images.rest.js` which is provided in
[this StackOverflow post](http://stackoverflow.com/a/21115779):

```JavaScript
function transformImageRequest(data) {
    if (data === undefined)
        return data;

    var fd = new FormData();
    angular.forEach(data, function(value, key) {
      if (value instanceof FileList) {
        if (value.length == 1) {
          fd.append(key, value[0]);
        } else {
          angular.forEach(value, function(file, index) {
            fd.append(key + '_' + index, file);
          });
        }
      } else {
        fd.append(key, value);
      }
    });

    return fd;
}
```

Next we need to tell our REST endpoint in JavaScript to use this method to transform the request data when we want to `save` (upload) an image:
```JavaScript
myApp.factory('Images', function($resource) {
    return $resource('/api/images/:pk/', {'pk': '@pk'}, {
        'save': {
            method: 'POST',
            transformRequest: transformImageRequest,
            headers: {'Content-Type':undefined}
        },
    });
});
```

## Working with File Fields in AngularJS
Now we could just call the `save` method of the `Images` factory, though we are not quite there yet. A 
[comment on GitHub](https://github.com/angular/angular.js/issues/1375#issuecomment-21933012) provides us
a directive which handles file fields in HTML a little better (than plain HTML would do). We can copy paste 
this code into a new file `static/js/filesModelDirective.js`:
```JavaScript
function filesModelDirective(){
  return {
    controller: function($parse, $element, $attrs, $scope){
      var exp = $parse($attrs.filesModel);

      $element.on('change', function(){
        exp.assign($scope, this.files);
        $scope.$apply();
      });
    }
  };
}

myApp.directive('filesModel', filesModelDirective);
```

Make sure to include the created JavaScript file in index.html like this:
```HTML
    ...
    <!-- Include our app -->
    <script src="js/app.js"></script>
    <!-- Include our own controllers, factories, directives, etc... -->
    <script src="js/filesModelDirective.js"></script>
    <script src="js/images.rest.js"></script>
    ...
```


## Writing the View and Controller for Uploading
Now that we got the pre-requesits out of the way, let's write the actual code.
First of all we need a `<form>` with a file input field (using the directive `filesModel` we just created) and a submit button in `static/index.html`:
```HTML
<!-- Main Division -->
<div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
    <form class="form" name="form" ng-submit="uploadImage()">
        <input type="file" files-model="newImage.image">
        <button type="submit">Save</button>
    </form>

     ...
</div>
```

Second, we need to implement the `uploadImage` method (as specified in `ng-submit`) and define the `newImage` scope variable.
We do this in `static/js/app.js` in `MainCtrl`:
```JavaScript
// Main Controller
myApp.controller('MainCtrl', function($scope, Images)
{
    console.log('In main Control');
    $scope.images = Images.query();

    $scope.newImage = {};

    $scope.uploadImage = function()
    {
        // call REST API endpoint
        Images.save($scope.newImage).$promise.then(
            function(response) {
                // the response is a valid image, put it at the front of the images array
                $scope.images.unshift(response);
            },
            function(rejection) {
                console.log('Failed to upload image');
                console.log(rejection);
            }
        );
    };
});
```

When `save` is successful, we will add the response (an entry with the URL and primary key) to the beginning of our local
dataset `$scope.images`, by calling `unshift(response)`. If the `save` method failed, we will log the error in the developers
console.

We can now refresh the page and try to upload an image. If you are having trouble uploading, e.g., because of an 
invalid CSRF token, you can try logging out of the Django Admin or just open an Anonymous Browsing session.
We will handle authentication much later in this tutorial, for now the endpoints are anonymous.