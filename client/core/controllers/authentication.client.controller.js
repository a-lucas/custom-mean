/**
 * Created by bodhi on 1/21/16.
 */
'use strict';

angular.module('core').controller('AuthenticationController',
  function ($scope, $state, Authentication, OAuthdService) {


    OAuthdService.getAvailableProviders().then(function(result) {
      $scope.authenticationProviders = result;
    });

    $scope.authenticate = function(provider) {
      OAuthdService.login(provider).then(function (user) {
        Authentication.user = user.data;
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }, function(err) {
        throw err;
      });
    };

  });
