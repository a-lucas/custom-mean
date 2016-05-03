/**
 * Created by bodhi on 1/21/16.
 */
'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('OAuthdService', ['$http', '$q',
  function ($http, $q) {

    this.availableProviders = [];

    this.getAvailableProviders = function() {
      var defer = $q.defer();

      if (this.availableProviders.length >0) {
        console.log('availableProviders already loaded', this);
        defer.resolve(this.availableProviders);
      }
      var that = this;
      $http.get('/getAvailableProviders').then(function(providers) {
        that.availableProviders = providers.data;
        defer.resolve(that.availableProviders);
      }, function(err) {
        defer.reject(err);
      });
      return defer.promise;
    };


    this.login = function (provider) {

      var defer = $q.defer();
      //todo check the provider validity

      $http.get('/oauth_state_token').then(function (res) {
        var token = res.data.token;
        OAuth.setOAuthdURL('http://localhost:6284');
        OAuth.initialize('Ljs_v2bxsG77cXLXtkWaOm4nAHE');
        console.log(OAuth);
        
        OAuth.popup(provider, {
          state: token
        }).done(function (result) {
          $http.post('oauth_set_code', result).then(function (res) {
            defer.resolve(res);
          }, function (err) {
            defer.reject(err);
          });

        });
      });

      return defer.promise;
    };

  }
]);
