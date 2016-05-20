'use strict';

// Authentication service for user variables
angular.module('core').factory('Authentication', ['$window', '$http', function ($window, $http) {
	return {
    user: $window.user,
    logout: function () {
      $window.location = '/signout';
    },
    getProvidersStatus: function () {
      return $http.get('/getProvidersStatus');
    },
    isLoggedIn: function () {
      return this.user && this.user.roles && this.user.roles.length > 0;
    },
    isAllowed: function (roles) {
			return _.intersection(roles, this.user.roles).length > 0;
    }
  };
}]);
