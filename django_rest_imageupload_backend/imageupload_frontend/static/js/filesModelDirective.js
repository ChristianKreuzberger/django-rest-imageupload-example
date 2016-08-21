'use strict';
// FROM https://github.com/angular/angular.js/issues/1375#issuecomment-21933012
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

myApp.directive('filesModel', filesModelDirective)