# Step 6: Set up a basic page using AngularJS

## Install AngularJS
In the [previous step](step5.md) of this tutorial we have set up the basics for our frontend application.
Now it is time to set up a simple page using [Angular](https://angularjs.org/).

We are going to use the [Node Package Manager](https://www.npmjs.com/) (npm) for maintaining a local package 
repository (you can install it on Debian/Ubuntu using ``apt-get install npm``).

To start, change to the `static/` directory inside your `imageupload_frontend` app:
```bash
cd imageupload_frontend/static/
```
Now install AngularJS (version 1.5.8) using the following command:
```bash
npm install angular
```
Install ngResource (a brilliant REST API library for Angular) using the following command:
```bash
npm install angular-resource
```

In addition, we should create a directory called `js` where all of our JavaScript code (like controllers, etc...) goes.
Your directory structure should now look as follows:

 * `django-rest-imageupload-example`
     * `django_rest_imageupload_backend`
         * `backend_app`
         * `imageupload`
         * `imageupload_frontend`
             * `static`
                 * `js`
                 * `node_modules`
                     * `angular`
                     * `angular-resource`
                 * `index.html`
         * `imageupload_rest`
         * `manage.py`
     * `venv`
     
## Set up a basic AngularJS page
First we need to create our app and a controller in JavaScript. Create a file called `app.js` in the `js/` directory with the following content:
```JavaScript
var myApp = angular.module('imageuploadFrontendApp', ['ngResource']);

myApp.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
});

myApp.controller('MainCtrl', function($scope)
{
    console.log('In main Control');
});
```

The counterpart of the controller is the view, which will be written entirely in HTML. Edit our previously created `index.html` with the following content:
```HTML
<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
    <!-- Include Angular and several angular libraries -->
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/angular-resource/angular-resource.min.js"></script>

    <!-- Include our app -->
    <script src="js/app.js"></script>
    <!-- Include our own controllers, factories, directives, etc... -->
</head>
<body>

<div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
  Hello World
</div>

</body>
</html> 
```

Open up your browser and look at the console output. You should see the message `In main Control` and nothing else.

## Set up the REST endpoint
Create a new file in the `js/` directory called `images.rest.js` with the following content:
```JavaScript
myApp.factory('Images', function($resource) {
  return $resource('/api/images/:pk');
});
```
Make sure to include this new file in `index.html` AFTER `app.js`:
```HTML
    <!-- Include our app -->
    <script src="js/app.js"></script>
    <!-- Include our own controllers, factories, directives, etc... -->
    <script src="js/images.rest.js"></script>
```
and also add some output to it (by replacing the main division):
```HTML
<div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
  <textarea rows="10" cols="100">{{ images }}</textarea>
</div>
```

Furthermore, we are going to edit our `MainCtrl` in app.js to look as follows:
```JavaScript
myApp.controller('MainCtrl', function($scope, Images)
{
    console.log('In main Control');
    $scope.images = Images.query();
});
```

If you refresh the page in your browser, you should see some JSON Code output in a textarea element.

## Display images
One of the convenient features of AngularJS is that you can iterate over a dataset, e.g., coming from a REST endpoint, 
using very simple HTML code. We can make use of this and display list of images by using the following HTML code:
```HTML
<div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
    <textarea rows="10" cols="100">{{ images }}</textarea>

    <div ng-repeat="image in images track by image.pk">
        <h3>Image {{ image.pk }}</h3>
        <a href="{{ image.image }}">{{ image.image }}</a><br />
        <img ng-src="{{ image.image }}" width="800">
    </div>

</div>
```

Refresh the page in your browser and you should see a (not so pretty) list of images.
Now that we can visually see all images, it makes sense to remove the textarea in `index.html`.