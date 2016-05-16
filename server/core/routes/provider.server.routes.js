/**
 * Created by antoine on 9/03/16.
 */
'use strict';

module.exports = function (app) {

  var provider = require('../controllers/providers.server.controller');

  app.route('/getAvailableProviders').get(provider.getAvailableProviders);

  app.route('/initProviders').get(provider.getLogos);
  
  app.route('/getProvidersStatus').get(provider.getProvidersStatus);

};
