angular.module('productTesting')

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
                // scope.fileReader = contents;
                // use data in 'contents' to add products to db
                scope.$parent.parseCSV(contents);
              });
          };

          r.readAsText(files[0]);
        }
      });
    }
  };
});