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

app.factory('Candy', ['$firebaseArray', function($firebaseArray){
  const ref = firebase.database().ref('candy');
  return $firebaseArray(ref);
}])

app.factory('Buy', ['$firebaseArray', '$firebaseObject', function($firebaseArray, $firebaseObject){
  const ref = firebase.database().ref('buy');
  const candy = firebase.database().ref('candy');

  const list = $firebaseArray.$extend({
    $$added: function(snap) {
      const record = $firebaseArray.prototype.$$added.call(this, snap);
      record.candy = $firebaseObject(candy.child(record.candyId));
      return record;
    }
  });

  return new list(ref);
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

  $scope.insert = function() {
    console.log($scope.selectedCandy);
    $scope.buyList.$add({
      count: $scope.count,
      candyId: $scope.selectedCandy.$id,
      date: new Date().getTime()
    })
  }
}]);

app.controller('SellCtrl', ['$scope', 'Sell', 'Candy', 'Auth', function($scope, Sell, Candy, Auth) {
  $scope.sellList = Sell;
  $scope.candyList = Candy

 // Todo : Skrifa út nafnið á vörunni sem var seld
 // Halda utan um inventory

  $scope.sell = function(id) {
    $scope.sellList.$add({
      candyId: id,
      user: Auth.$getAuth().uid,
      date: new Date().getTime()
    })
  }
}]);
