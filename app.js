angular.module('productTesting',["firebase"])

.controller('productTable',['$scope', '$firebaseObject', function($scope, $firebaseObject){
  var ref = new Firebase("https://producttesting.firebaseio.com");
  var firebaseObj = $firebaseObject(ref);
  firebaseObj.$loaded().then(function() {
    $scope.data = firebaseObj;
   });
  $scope.currentData = {};
  $scope.parseCSV = function(data){
    var rows = data.split('\r');
    var rowData;
    for (var i=1; i<rows.length; i++){
      rowData = rows[i].split(',');
      $scope.addProduct(rowData[0],rowData[1]);
    }
  };

  $scope.initDB = function(){
    $scope.data['productTestDB'] = { // Clears the database and sets up the tables
      products: {
        Water: {
          manufacturer: "Team Z",
          verified: true
        }
      },
      tests: [],
      product_tests: {
        "Water|Water Test": {
          comment: 'n/a',
          date_time: 1445920730678,
          product: 'Water',
          test: 'Water Test',
          status: 'pending'
        }
      },
    };
    console.log('DB initialized');
    // adds three tests
    $scope.addTest('Complete Documentation', 'Do the docs meet all of our requirements?');
    $scope.addTest('QA Test', 'Checks run by Quality Assurance Team');
    $scope.addTest('Beta Test', 'Initial testing with select beta testers');

    $scope.saveDB();
  };

  $scope.saveDB = function(cb){
    firebaseObj.$save().then(function(ref) {
      ref.key() === firebaseObj.$id; // true //  is this needed?
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

  $scope.setCurrentPT = function(product, test){
    $scope.currentData.product = product;
    $scope.currentData.test = test;
  };

  $scope.addProduct = function(name, manufacturer){
    $scope.data['productTestDB'].products[name] = {
      manufacturer: manufacturer,
      verified: false,
    };
    // Adds some product tests
    angular.forEach($scope.data['productTestDB'].tests, function(value, key) {
       $scope.addProductTest(name, value.name);
    });
    $scope.saveDB();
  }

  $scope.verifyProduct = function(name){
    $scope.data['productTestDB'].products[name].verified = true;
    $scope.saveDB();
  };

  $scope.addProductTest = function(product, test){
    $scope.data['productTestDB'].product_tests[product+'|'+test] = {
      product: product,
      test: test,
      date_time: Date.now(),
      status: 'pending',
      comment: 'n/a',
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

  $scope.setProductTestComment = function(product, test, comment){
    $scope.data['productTestDB'].product_tests[product+'|'+test].comment = comment;
    $scope.currentData.comment = "";
    $scope.saveDB();
  };

  $scope.getFailedTestsThisWeek = function(){
    var results = [];
    var minAge = new Date();
    minAge.setDate(minAge.getDate()-7);
    angular.forEach($scope.data['productTestDB'].product_tests, function(value, key) {
       if (value.date_time > minAge){
        if (value.status === 'fail'){
          results.push(key);
        }
       }
    });
    alert("Tests failed this week: "+results);
    return results;
  };

  $scope.getTests = function(options){
    var results = [];
    var status = options.status;
    var age = options.daysOlderThan;
    var minAge = new Date();
    minAge.setDate(minAge.getDate()-age);
    angular.forEach($scope.data['productTestDB'].product_tests, function(value, key) {
       if (value.date_time < minAge){
        if (value.status === status){
          results.push(key);
        }
       }
    });
    return results;
  };

  $scope.getTestsForProduct = function(product){
    var results = [];
    angular.forEach($scope.data['productTestDB'].product_tests, function(value, key) {
       if (value.product === product){ results.push(value); }
    });
    return results;
  };

  $scope.validateProductsWhichTestsAreComplete = function(){
    var tests;
    var results = [];
    angular.forEach($scope.data['productTestDB'].products, function(value, key) {
       tests = $scope.getTestsForProduct(key);
       if (tests.filter(function(element){
        return element.status !== 'pass';
       }).length === 0){
        $scope.verifyProduct(key);
        results.push(key);
       }
    });
    if (results.length > 0){
      alert('Verified products: '+results);
    }
  };

}]);
