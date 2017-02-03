"use strict";
var myApp = angular.module('imageuploadFrontendApp', ['ngResource', 'ngFileUpload']);

/**
 * Configure our angular app
 */
myApp.config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});

/**
 * Main Controller of our App
 * Handles the image upload within the frontend
 */
myApp.controller('MainCtrl', function($scope, Images)
{
    console.log('In main Control');
    // query images from REST API
    $scope.images = Images.query();

    $scope.newImage = {};

    /**
     * Upload an Image on Button Press
     */
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
});


