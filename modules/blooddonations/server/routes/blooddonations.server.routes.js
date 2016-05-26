'use strict';

/**
 * Module dependencies
 */
var blooddonationsPolicy = require('../policies/blooddonations.server.policy'),
  blooddonations = require('../controllers/blooddonations.server.controller');

module.exports = function(app) {
  // Blooddonations Routes
  app.route('/api/blooddonations').all(blooddonationsPolicy.isAllowed)
    .get(blooddonations.list)
    .post(blooddonations.create);

  app.route('/api/blooddonations/:blooddonationId').all(blooddonationsPolicy.isAllowed)
    .get(blooddonations.read)
    .put(blooddonations.update)
    .delete(blooddonations.delete);

  // Finish by binding the Blooddonation middleware
  app.param('blooddonationId', blooddonations.blooddonationByID);
};
