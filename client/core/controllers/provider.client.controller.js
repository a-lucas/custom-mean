/**
 * Created by bodhi on 1/21/16.
 */
'use strict';

angular.module('core').controller('ProvidersController',
  function ($scope, $state, LxDialogService, UserService) {

    UserService.getProviders().then(function(providers) {
      $scope.providers = providers.data;
    });


    $scope.openDialog = function() {
      LxDialogService.open('providerDialog');
    };

  });
