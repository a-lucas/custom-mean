'use strict';

// Authentication service for user variables
angular.module('core').factory('Authentication', ['$window', '$http', function ($window, $http) {

  var _linkedProviders = [];

  return {
    user: $window.user,
    logout: function() {
      $window.location = '/signout';
    },
    getProvidersStatus: function() {
      return $http.get('/getProvidersStatus');
    }
  };
}]);
