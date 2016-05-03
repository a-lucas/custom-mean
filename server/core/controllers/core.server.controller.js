'use strict';
var debug = require('debug')('oath:core.server.controller');
/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {

  var safeUserObject = null;
  if (req.session.user) {
    safeUserObject = req.session.user;
  }

  debug('rendering safeUserObject: ', safeUserObject);

  res.render('server/core/views/index', {
    user: safeUserObject
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('server/core/views/500', {
    error: 'Oops! Something went wrong...'
  });
};


/**
 * Signout
 */
exports.signout = function (req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('server/core/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
