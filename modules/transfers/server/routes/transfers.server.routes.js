'use strict';

/**
 * Module dependencies
 */
var transfersPolicy = require('../policies/transfers.server.policy'),
  transfers = require('../controllers/transfers.server.controller');

module.exports = function(app) {
  // Transfers Routes
  app.route('/api/transfers').all(transfersPolicy.isAllowed)
    .get(transfers.list)
    .post(transfers.create);

  app.route('/api/transfers/:transferId').all(transfersPolicy.isAllowed)
    .get(transfers.read)
    .put(transfers.update)
    .delete(transfers.delete);

  // Finish by binding the Transfer middleware
  app.param('transferId', transfers.transferByID);
};
