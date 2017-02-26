"use strict";

var myApp = angular.module('imageuploadFrontendApp', [
    'ngResource',
    'ngFileUpload',
    'ngAnimate',
    'toaster'
]);

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
myApp.controller('MainCtrl', function($scope, Images, toaster)
{
    console.log('In main Control');

    /**
     * An array containing all the images shown on the page
     * @type {Array}
     */
    $scope.images = [];

    $scope.newImage = {};

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

                // reset newImage
                $scope.newImage = {};

                toaster.pop('success', "Image uploaded!");
            },
            function(rejection) {
                console.log('Failed to upload image');
                console.log(rejection);
                toaster.pop('error', "Failed to upload image");
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
                var idx = $scope.images.indexOf(image);
                if (idx < 0) {
                    console.log('Error: Could not find image');
                } else {
                    $scope.images.splice(idx, 1);
                }

                toaster.pop('success', "Image deleted");

                // alternatively, update $scope.images from REST API
                // $scope.loadImages();
            },
            function(rejection)
            {
                // failed to delete it
                console.log('Failed to delete image');
                console.log(rejection);
                toaster.pop('error', "Failed to delete image");
            }
        );
    };


    // load images from API
    $scope.loadImages();
});


