'use strict';

/**
 * Module dependencies
 */
var donnorsPolicy = require('../policies/donnors.server.policy'),
  donnors = require('../controllers/donnors.server.controller');

module.exports = function(app) {
  // Donnors Routes
  app.route('/api/donnors').all(donnorsPolicy.isAllowed)
    .get(donnors.list)
    .post(donnors.create);

  app.route('/api/donnors/:donnorId').all(donnorsPolicy.isAllowed)
    .get(donnors.read)
    .put(donnors.update)
    .delete(donnors.delete);

  // Finish by binding the Donnor middleware
  app.param('donnorId', donnors.donnorByID);
};
