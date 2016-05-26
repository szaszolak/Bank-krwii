'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Donnor = mongoose.model('Donnor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Donnor
 */
exports.create = function(req, res) {
  var donnor = new Donnor(req.body);
  donnor.user = req.user;

  donnor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donnor);
    }
  });
};

/**
 * Show the current Donnor
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var donnor = req.donnor ? req.donnor.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  donnor.isCurrentUserOwner = req.user && donnor.user && donnor.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(donnor);
};

/**
 * Update a Donnor
 */
exports.update = function(req, res) {
  var donnor = req.donnor ;

  donnor = _.extend(donnor , req.body);

  donnor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donnor);
    }
  });
};

/**
 * Delete an Donnor
 */
exports.delete = function(req, res) {
  var donnor = req.donnor ;

  donnor.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donnor);
    }
  });
};

/**
 * List of Donnors
 */
exports.list = function(req, res) { 
  Donnor.find().sort('-created').populate('user', 'displayName').exec(function(err, donnors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donnors);
    }
  });
};

/**
 * Donnor middleware
 */
exports.donnorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Donnor is invalid'
    });
  }

  Donnor.findById(id).populate('user', 'displayName').exec(function (err, donnor) {
    if (err) {
      return next(err);
    } else if (!donnor) {
      return res.status(404).send({
        message: 'No Donnor with that identifier has been found'
      });
    }
    req.donnor = donnor;
    next();
  });
};
