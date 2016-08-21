var myApp = angular.module('imageuploadFrontendApp', ['ngResource']);

myApp.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
});

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