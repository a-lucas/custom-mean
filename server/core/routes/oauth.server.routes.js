/**
 * Created by antoine on 9/03/16.
 */
'use strict';

module.exports = function (app) {

  var oauth = require('../controllers/oauth.server.controller');

  app.route('/oauth_state_token').get(oauth.oauthd);

  app.route('/oauth_set_code').post(oauth.oauthdSetCode);

};
