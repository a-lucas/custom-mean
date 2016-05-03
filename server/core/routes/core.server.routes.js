'use strict';

module.exports = function (app) {

  var core = require('../controllers/core.server.controller');

  app.route('/server-error').get(core.renderServerError);

  app.route('/signout').get(core.signout);

  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  app.route('/').get(core.renderIndex);
};
