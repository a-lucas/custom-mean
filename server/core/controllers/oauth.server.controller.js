/**
 * Created by antoine on 1/21/16.
 */

'use strict';

var Q = require('q'),
  providerHelpers = require('../helpers/user.provider'),
  OAuth = require('oauthio'),
  debug = require('debug')('oauth:oauth.server.controller'),
  config = require('../../../config/config'),
  jwt = require('jwt-simple');



/* todo
  get this from config file
 */

exports.oauthd = function (req, res) {
  OAuth.setOAuthdURL(config.oauthd.serverUrl);
  OAuth.initialize(config.oauthd.OAUTHD_ID, config.oauthd.OAUTHD_SECRET);
  res.send(200, { token: OAuth.generateStateToken(req.session) });
};


/**
 * OAUTH
 * @param req
 * @param res
 */
exports.oauthdSetCode = function (req, res) {

  OAuth.setOAuthdURL(config.oauthd.serverURL);
  OAuth.initialize(config.oauthd.OAUTHD_ID, config.oauthd.OAUTHD_SECRET);

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

            var token = jwt.encode({
              user: user._id,
              roles: user.roles
            }, config.jwt.secret);

            user.token = token;
            res.set(config.jwt.authHeaderName, token);
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
