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
        roles: [],
        templateUrl: path + 'home.client.view.html'
      })
      .state('not-found', {
        url: '/not-found',
        roles: [],
        templateUrl: path + '404.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        roles: [],
        templateUrl: path + '400.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        roles: [],
        templateUrl: path + '403.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('authentication', {
        url: '/authentication',
        roles: [],
        templateUrl: path + 'authentication.client.view.html'
      })
      .state('home.providers', {
        url: 'providers',
        roles: ['user', 'admin'],
        templateUrl: path + 'providers.client.view.html'
      })
      .state('home.me', {
        url: 'me',
        roles: ['user', 'admin'],
        templateUrl: path + 'me.client.view.html'
      });

  }
]);
