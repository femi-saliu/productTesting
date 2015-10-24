angular.module('productTesting',["firebase"])

.controller('productTable',['$scope',function($scope){
  var ref = new Firebase("https://producttesting.firebaseio.com");
  $scope.data = $firebaseObject(ref);

  $scope.initDB = function(){
    $scope.data = { // Clears the database and sets up the tables
      products: {},
      tests: [],
      product_tests: [],
    };
  };

  $scope.saveDB = function(cb){
    ref.$save().then(function(ref) {
      if (cb) { cb(ref); }
      else { console.log("Save successful.")}
    }, function(error) {
      console.log("Error:", error);
    });
  }
  $scope.addTest = function(name, description){
    $scope.data.tests.push({
      name: name,
      description: description,
    });
    $scope.saveDB();
  };

  $scope.addProduct = function(name, manufacturer){
    $scope.data.products[name] = {
      manufacturer: manufacturer,
      state: "unverified",
    };
    $scope.saveDB();
  }

  $scope.verifyProduct = function(name){
    $scope.data.products[name].state = "verified";
    $scope.saveDB();
  };

}]);