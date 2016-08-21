myApp.factory('Images', function($resource) {
  return $resource('/api/images/:pk');
});