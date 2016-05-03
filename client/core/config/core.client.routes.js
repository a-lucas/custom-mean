'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    var path = 'client/core/views/';
    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: path + 'home.client.view.html'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: path + '404.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: path + '400.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: path + '403.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('authentication', {
        //abstract: true,
        url: '/authentication',
        templateUrl: path + 'authentication.client.view.html'
      })
      .state('home.providers', {
        //abstract: true,
        url: 'providers',
        templateUrl: path + 'providers.client.view.html'
      });

  }
]);
