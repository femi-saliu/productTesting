angular.module('productTesting')

/**
 * Custom Directive which accepts a csv file then passes it to a parsing function
 */

.directive('fileReader', function() {
  return {
    scope: {
      fileReader:"="
    },
    link: function(scope, element) {
      $(element).on('change', function(changeEvent) {
        var files = changeEvent.target.files;
        if (files.length) {
          var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;
              scope.$apply(function () {
                scope.$parent.parseCSV(contents);
              });
          };
          r.readAsText(files[0]);
        }
      });
    }
  };
});