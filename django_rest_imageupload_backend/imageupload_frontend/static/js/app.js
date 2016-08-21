var myApp = angular.module('imageuploadFrontendApp', ['ngResource']);

myApp.controller('MainCtrl', function($scope, Images)
{
    console.log('In main Control');
    $scope.images = Images.query();
});