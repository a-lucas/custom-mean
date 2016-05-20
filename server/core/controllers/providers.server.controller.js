/**
 * Created by antoine on 9/03/16.
 */
'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  request = require('request'),
  debug = require('debug')('oauth:providers.server.controller'),
  Provider = mongoose.model('Provider'),
  child_process = require('child_process').exec,
  Q = require('q'),
  async = require('async'),
  config = require('./../../../config/config');
/**
 * cache the list of available providers
 * @type {Array}
 */
var providers = [];

var getLogos = exports.getLogos = function(req, res) {

  var base = config.oauthd.serverURL;

  if (providers.length === 0) {
    debug('going to signin');

    request.post(
      {
        url: base + '/signin',
        json: true,
        body: {
          'name': config.oauthd.login,
          'pass': config.oauthd.pss
        }
      },
      function (err, res, body) {
        if (err) {
          err = err + '. OAuth Server not started.';
          debug(' signing error', err);
          throw err;
        }

        if (body.status === 'success') {

          var headers = {
            'authorization': 'Bearer ' + body.data.accessToken
          };

          ///api/apps/:key/keysets
          ///api/providers
          ///api/providers/:provider
          ///api/providers/:provider/logo

          var appKey = config.oauthd.OAUTHD_ID;

          var baseRequest = request.defaults({
            headers: headers
          });

          var fetch = function(provider, cb){
            var path = '/api/providers/' + provider + '/logo';

            baseRequest.get(base + path, function(err, response, body){
              if (err){
                cb(err);
              } else {
                response.path = path;
                response.provider = provider;
                cb(null, response);
              }
            });
          };
          baseRequest.get(base + '/api/providers', function(err, response, body) {
            if (err) {
              throw err;
            } else {
              var res = response.toJSON();
              if (res.statusCode !== 200) {
                throw res.statusMessage;
              }
              body = JSON.parse(res.body);

              var providerLogoURLs = body.data.map(function(pro) {
                return pro.provider;
              });

              var fs = require('fs');

              providerLogoURLs.forEach(function(provider) {
                var path = '/api/providers/' + provider + '/logo';
                var filename = __dirname + '/../../../public/providers/' + provider + '.png';

                request.get({ url: base + path, encoding: 'binary' }, function (err, response, body) {
                  fs.writeFile(filename, body, 'binary', function(err) {
                    if(err) {
                      console.log(err);
                    }
                    else {
                      console.log('The file was saved!' + filename);
                    }
                  });
                });

              });

            }
          });
        } else {
          throw body.status;
        }
      });
  }
};

var signInOAuthd = exports.signInOAuthd = function() {

  var defer = Q.defer();

  var base= config.oauthd.serverURL;

  var appKey = config.oauthd.OAUTHD_ID;

  debug('going to signin');

  request.post(
    { url: base + '/signin',
      json: true,
      body: {
        'name': config.oauthd.login,
        'pass': config.oauthd.pass
      }
    },
    function(err, res, body) {
      if (err) {
        err = err + '. OAuth Server not started.';
        debug(' signing error', err);
        defer.reject(err);
        throw err;
      }

      if (body.status === 'success') {

        var headers = {
          'authorization': 'Bearer '+ body.data.accessToken
        };

        ///api/apps/:key/keysets
        ///api/providers
        ///api/providers/:provider
        ///api/providers/:provider/logo

        var baseRequest = request.defaults({
          headers: headers
        });

        var fetch = function(path, cb){
          baseRequest.get(base + path, function(err, response, body){
            if (err){
              cb(err);
            } else {
              var res = response.toJSON();
              if (res.statusCode !== 200) {
                cb(res.statusMessage);
              }
              body = JSON.parse(res.body);

              if (body.status === 'success') {
                cb(null, body.data);
              } else {
                debug('fetch error no exception - ', path, body);
                cb(body);
              }
            }
          });
        };
        fetch('/api/apps/' + appKey + '/keysets', function(err, results){
          if (err){
            defer.reject(err);
          } else {
            console.log(results);
            defer.resolve(results);
          }
        });
      } else {
        defer.reject(body.status);
      }
    }
  );

  return defer.promise;
};


exports.getAvailableProviders = function(req, res, next) {

  signInOAuthd().then(function(providers) {
    console.log('available providers = ', providers);
    res.status(200).json(providers);
  }, function(err) {
    console.log('error found: ', err);
    res.status(500).json(err);
  });
};

exports.getProvidersStatus = function(req, res, next) {
  if(!req.session.user) {
    return res.status(503).format({
      'application/json': function() {
        res.json({ error: 'Forbidden' });
      }
    });
  }

  var user = req.session.user;

  this.signInOAuthd().then(function(providers) {
    Provider.find({
      '_id': { $in: user.providers }
    }, function(err, linkedProviders){
      if (err) {
        return res.status(500).format({ error: err });
      }

      var json = {
        linkedProviders: linkedProviders,
        unlinkedProviders: _.filter(providers, function(provider) {
          linkedProviders.forEach(function(linkedProvider) {
            if(provider.name === linkedProvider.providerName) {
              return false;
            }
          });
          return true;
        })
      };
      return res.status(200).json(json);

    });

  }, function(err) {
    console.error(err);
  });
  
};
