'use strict';
const app = angular.module('baeting',['firebase']);
app.config(() => {
  const config = {
    apiKey: "AIzaSyDHGJT4If7Fw8NmfqDQWfQdv_dN8z50nP0",
    authDomain: "hallakaffi-2d2fb.firebaseapp.com",
    databaseURL: "https://hallakaffi-2d2fb.firebaseio.com",
    projectId: "hallakaffi-2d2fb",
    storageBucket: "hallakaffi-2d2fb.appspot.com",
    messagingSenderId: "440383505953"
  }
  firebase.initializeApp(config);
});

app.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
  return $firebaseAuth();
}]);

app.factory('Candy', ['$firebaseArray','$firebaseObject', function($firebaseArray, $firebaseObject){
  const ref = firebase.database().ref('candy');
  return $firebaseArray(ref);
}])

app.factory('Buy', ['$firebaseArray', function($firebaseArray){
  const ref = firebase.database().ref('buy');  
  
  const buy = $firebaseArray.$extend({
    $$added: function(snap) {
      console.log(snap.val()); 
      return snap.val();
    }    
  });

  return buy(ref);
  //return $firebaseArray(ref);
}])

app.factory('Sell', ['$firebaseArray', function($firebaseArray){
  const ref = firebase.database().ref('sell');  
  return $firebaseArray(ref);
}])


app.controller('HomeCtrl', ['$scope', 'Auth', function($scope, Auth) {
  $scope.login = function() {
    Auth.$signInWithEmailAndPassword($scope.username,$scope.password).then(authData => {
      $scope.loginMessage = 'Skráður inn. Númerið þitt er: ' + authData.uid;
    }).catch(error => {
      if (error.code === 'auth/wrong-password') {
        $scope.loginMessage = 'Vitlaust netfang eða lykilorð';
      }
      console.log(error);
    });
  }
}]);

app.controller('CandyCtrl', ['$scope', 'Candy', function($scope, Candy) {
  $scope.candyList = Candy;
  
  $scope.insert = function() {
    $scope.candyList.$add({
      name: $scope.name,
      price: $scope.price
    })  
  }
}]);

app.controller('BuyCtrl', ['$scope', 'Buy','Candy', function($scope, Buy, Candy) {   
  $scope.buyList = Buy;  
  $scope.candyList = Candy;
  $scope.selectedCandy = null;

  $scope.getCandy = function(key) {
    const ref = firebase.database().ref('candy');
    return 'test';
  }
  
  $scope.insert = function() {
    console.log($scope.selectedCandy);
    $scope.buyList.$add({
      count: $scope.count,
      candy: $scope.selectedCandy.$id,
      date: new Date().getTime()
    })  
  }
}]);

app.controller('SellCtrl', ['$scope', 'Sell','Candy', function($scope, Sell, Candy) {   
  $scope.sellList = Sell;  
  $scope.candyList = Candy;
  $scope.selectedCandy = null;

  $scope.sell = function(id) {
    console.log(id);
  }
}]);
