angular.module('productTesting',["firebase"])

.controller('productTable',['$scope', '$firebaseObject', function($scope, $firebaseObject){
  var ref = new Firebase("https://producttesting.firebaseio.com");
  var firebaseObj = $firebaseObject(ref);
  firebaseObj.$loaded().then(function() {
    $scope.data = firebaseObj;
   });

  $scope.initDB = function(){
    $scope.data['productTestDB'] = { // Clears the database and sets up the tables
      products: {},
      tests: [],
      product_tests: [],
    };
    console.log('DB initialized');
    // add three tests
    $scope.addTest('Complete Documentation', 'Do the docs meet all of our requirements?');
    $scope.addTest('QA Test', 'Checks run by Quality Assurance Team');
    $scope.addTest('Beta Test', 'Initial testing with select beta testers');

    $scope.saveDB();
  };

  $scope.saveDB = function(cb){
    firebaseObj.$save().then(function(ref) {
      ref.key() === firebaseObj.$id; // true
      if (cb) { cb(ref); }
      else { console.log("Save successful.", firebaseObj)}
    }, function(error) {
      console.log("Error:", error);
    });
  }
  $scope.addTest = function(name, description){
    $scope.data['productTestDB'].tests.push({
      name: name,
      description: description,
    });
    $scope.saveDB();
  };

  $scope.addProduct = function(name, manufacturer){
    $scope.data['productTestDB'].products[name] = {
      manufacturer: manufacturer,
      state: "unverified",
    };
    // Add 3 product tests
    angular.forEach($scope.data['productTestDB'].tests, function(value, key) {
       $scope.addProductTest(name, value.name);
    });
    $scope.saveDB();
  }

  $scope.verifyProduct = function(name){
    $scope.data['productTestDB'].products[name].state = "verified";
    $scope.saveDB();
  };

  $scope.addProductTest = function(product, test){
    $scope.data['productTestDB'].product_tests[product+'|'+test] = {
      product: product,
      test: test,
      date_time: Date.now(),
      status: 'pending',
      comment: '',
    };
    $scope.saveDB();
  };

  $scope.passProductTest = function(product, test){
    $scope.data['productTestDB'].product_tests[product+'|'+test].status = 'pass';
    $scope.saveDB();
  };

  $scope.failProductTest = function(product, test){
    $scope.data['productTestDB'].product_tests[product+'|'+test].status = 'fail';
    $scope.saveDB();
  };

  $scope.setProductTestComment = function(product,test, comment){
    $scope.data['productTestDB'].product_tests[product+'|'+test].comment = comment;
    $scope.saveDB();
  };

}]);
// .factory('productDB', ['$scope', '$firebaseObject', function($scope, $firebaseObject){

//   function initDB(){}
//   function saveDB(){}
//   function addTest(){}
//   function addProduct(){}
//   function verifyProduct(){}
//   return {};
// }]);