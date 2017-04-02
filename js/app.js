'use strict';
const app = angular.module('baeting',['firebase']);
app.config(() => {
  const config = {
    apiKey: "AIzaSyD29Ud1WA6JXh3U3ZQJXTEmpy0uHXD_oB8",
    authDomain: "baetingarad.firebaseapp.com",
    databaseURL: "https://baetingarad.firebaseio.com",
    projectId: "baetingarad",
    storageBucket: "baetingarad.appspot.com",
    messagingSenderId: "74254762585"
  }
  firebase.initializeApp(config);
});

app.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
  return $firebaseAuth();
}]);

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
