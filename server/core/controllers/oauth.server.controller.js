/**
 * Created by antoine on 1/21/16.
 */

'use strict';

var Q = require('q'),
  providerHelpers = require('../helpers/user.provider'),
  OAuth = require('oauthio'),
  debug = require('debug')('oauth:oauth.server.controller');


var OAUTHD_ID = 'Ljs_v2bxsG77cXLXtkWaOm4nAHE';
var OAUTHD_SECRET = 'pfu1o7O5dry0llvQ9c0pSUxLF20';

exports.oauthd = function (req, res) {
  OAuth.setOAuthdURL('http://localhost:6284');
  OAuth.initialize(OAUTHD_ID, OAUTHD_SECRET);
  res.send(200, { token: OAuth.generateStateToken(req.session) });
};


/**
 * OAUTH
 * @param req
 * @param res
 */
exports.oauthdSetCode = function (req, res) {

  OAuth.setOAuthdURL('http://localhost:6284');
  OAuth.initialize(OAUTHD_ID, OAUTHD_SECRET);

  var provider = req.body.provider;
  var code = req.body.code;

  debug('code = %s', code);

  debug('Generate Token = %s', OAuth.generateStateToken(req));

  OAuth.auth(provider, req.session, {
    code: code //cf result.code client side
  }).then(
    function (obj) {
      signin(obj, provider)
        .then(
          function (user) {
            debug('REQ.SESSION = ', req.session);
            req.session.user = user;
            res.status(200).send(user);
          },
          function (err) {
            req.session.user = null;
            res.status(500).send(err);
          }
        );
    },
    function (err) {
      req.session.user = null;
      debug('Err thrown in OAuth.auth(), ', err);
      res.status(500).send(err);
    }
    )
    .fail(
      function (err) {
        req.session.user = null;
        debug('Err thrown in OAuth.auth(), ', err);
        res.status(500).send(err);
      }
    );

};

/**
 *
 * @param obj is the OAuth object
 */
var signin = exports.signin = function (obj, provider) {

  var deferred = Q.defer();
  var credentials = obj.getCredentials();

  var userData = {
    me: null,
    userId: null,
    provider: null,
    providerName: provider,
    user: null
  };

  obj.me().then(function (me) {

    userData.me = providerHelpers.loadInMe(me, credentials);

    providerHelpers.findProvider(userData)
      .then(providerHelpers.findUser)
      .catch(function (userData) {
        return providerHelpers.findProviderEmail(userData)//->rejects here
          .then(providerHelpers.createProvider)
          .then(providerHelpers.findUser)
          .then(providerHelpers.linkProviderToUser);
      })
      .catch(function (userData) {
        return providerHelpers.createUser(userData)
          .then(providerHelpers.createProvider)
          .then(providerHelpers.linkProviderToUser);
      })
      .fail(function (err) {
        deferred.reject(err);
      })
      .done(function (userData) {
        deferred.resolve(userData.user);
      });

  }, function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
};
