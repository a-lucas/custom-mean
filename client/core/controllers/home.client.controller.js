'use strict';

angular.module('core').controller('HomeController',
  function ($scope, Authentication) {
    $scope.authentication = Authentication;
  });
