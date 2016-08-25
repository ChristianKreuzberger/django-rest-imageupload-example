# Step 7: Uploading images using AngularJS
So far we have created a basic page that lists all our images. Now it is time to upload images.

## You just need to call the save() method - or maybe not...
We already defined our REST endpoint in `js/images.rest.js` which provides us with all the methods we need.
At least in theory. In practice, there seem to be [several problems](http://stackoverflow.com/a/21115779)
with uploading images, which can be solved using a `FormData` object.

First, we need to define a `transform` method in `js/images.rest.js` which is provided in
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

Next we need to tell our REST endpoint in JavaScript to use this method to transform the request data:
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

Now we could just call the `save` method of the `Images` factory, though we are not quite there yet. A 
[comment on GitHub](https://github.com/angular/angular.js/issues/1375#issuecomment-21933012) provides us
a directive which handles HTML file fields a little better than plain angular. We can copy paste this code
into `js/filesModelDirective.js`:
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
    <!-- Include our app -->
    <script src="js/app.js"></script>
    <!-- Include our own controllers, factories, directives, etc... -->
    <script src="js/filesModelDirective.js"></script>
    <script src="js/images.rest.js"></script>
```

## Writing the actual code
Now that we got the pre-requesits out of the way, let's write the actual code.
First of all we need a `<form>` with a file input field and a submit button in `index.html`:
```HTML
    <form class="form" name="form" ng-submit="uploadImage()">
        <input type="file" files-model="newImage.image">
        <button type="submit">Save</button>
    </form>
```

Second, we need to implement the `uploadImage` method (as specified in `ng-submit`) and define the `newImage` scope variable.
We do this in `app.js` in `MainCtrl`:
```JavaScript
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

We can now refresh the page and try to upload an image.