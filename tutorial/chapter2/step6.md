# Adding toast notifications
One of the things missing in our frontend are visual hints for the user that something has not worked. This can be solved
by adding toast notifications displaying some basic errors. From personal experience I can recommend using 
[AngularJS Toaster](https://github.com/jirikavi/AngularJS-Toaster).

## Installing Angular JS Toaster
We need to install angularjs-toaster aswell as angular-animate.
```bash
cd imageupload_frontend/static/
npm install angular-animate@1.5
npm install angularjs-toaster
```

We have to add the following includes:
```html
    <script src="node_modules/angular-animate/angular-animate.min.js"></script>
    <script src="node_modules/angularjs-toaster/toaster.min.js"></script>
    
    <link rel="stylesheet" href="node_modules/angularjs-toaster/toaster.min.css">
```

and add ``'toaster'`` aswell as ``'ngAnimate'`` to our app dependencies in ``app.js``:
```javascript
var myApp = angular.module('imageuploadFrontendApp', [
    'ngResource', 
    'ngFileUpload',
    'ngAnimate',
    'toaster'
]);
```

## Using Toast Notifications
First, we need to provide a place for toast notifications to be rendered into the DOM. Therefore we need to add 
```html
    <div ng-app="imageuploadFrontendApp" ng-controller="MainCtrl">
        <toaster-container></toaster-container>
```
to our index.html *within our ``ng-app``*.

To use these notifications we only have to inject ``toaster`` into our controller
```javascript
myApp.controller('MainCtrl', function($scope, Images, Toaster)
```
and then call
```javascript
toaster.pop('success', "It worked!", "Whatever you were doing, it worked!");
```

Obviously we should use better messages that make sense, for instance after uploading and after deleting images.
