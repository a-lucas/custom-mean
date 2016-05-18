/**
 * Created by antoinelucas on 12/05/2016.
 */

'use strict';
var authorization = require('./../helpers/authorization.middleware'),
  user = require('./../controllers/user.server.controller');

module.exports = function (app) {
  app.route('/user/details').get(authorization.hasRole(['user', 'admin']), user.details);
};
