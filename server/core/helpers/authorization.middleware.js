'use strict';
/**
 * Created by antoinelucas on 12/05/2016.
 */
var jwt = require('jwt-simple'),
  config = require('./../../../config/config'),
  _ = require('lodash');


exports.hasRole = function (roles) {
  return function (req, res, next) {
    var token = (req.body && req.body.access_token) ||
      (req.query && req.access_token) ||
      (req.headers[config.jwt.authHeaderName]);

    if (token) {
      try {
        var decoded = jwt.decode(token, config.jwt.secret);
        if (_.isString(roles)) {
          roles = [roles];
        }
        if (decoded.roles && _.intersection(decoded.roles, roles).length > 1) {
          next();
        }
      } catch(err) {
        res.send(401, {err: 'Invalid authorization token'});
      }
    } else {
      res.send(401, {err: 'Invalid authorization token'});
    }
  };
};