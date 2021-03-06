'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Blooddonation = mongoose.model('Blooddonation'),
  Donnor = mongoose.model('Donnor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Blooddonation
 */
exports.create = function(req, res) {
  var blooddonation = new Blooddonation(req.body);
  blooddonation.user = req.user;

  if(req.body.donnor){
    var donnor = JSON.parse(req.body.donnor);
    blooddonation.donnor = mongoose.Types.ObjectId(donnor._id);
  }    
  console.log("req.user");
  console.log(req.user);
  var station = blooddonation.user.station;//id

  blooddonation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blooddonation);
    }
  });
};

/**
 * Show the current Blooddonation
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var blooddonation = req.blooddonation ? req.blooddonation.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  blooddonation.isCurrentUserOwner = req.user && blooddonation.user && blooddonation.user._id.toString() === req.user._id.toString() ? true : false;

  Donnor.findById(blooddonation.donnor).exec(function (err, found) {
    console.log("db findById Donnor:");
    console.log(found);
    if(err){
        return res.status(404).send({
          message: err
        });
    } else {
      blooddonation.donnor = found;
      res.jsonp(blooddonation);
    }
  });
};

/**
 * Update a Blooddonation
 */
exports.update = function(req, res) {
  var blooddonation = req.blooddonation ;

  blooddonation = _.extend(blooddonation , req.body);

  blooddonation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blooddonation);
    }
  });
};

/**
 * Delete an Blooddonation
 */
exports.delete = function(req, res) {
  var blooddonation = req.blooddonation ;

  blooddonation.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(blooddonation);
    }
  });
};

/**
 * List of Blooddonations
 */
exports.list = function(req, res) { 
  Blooddonation.find().sort('-created').populate('user', 'displayName').populate('donnor').exec(function(err, blooddonations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.jsonp(blooddonations);
    }
  });
};

/**
 * Blooddonation middleware
 */
exports.blooddonationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Blooddonation is invalid'
    });
  }

  Blooddonation.findById(id).populate('user', 'displayName').exec(function (err, blooddonation) {
    if (err) {
      return next(err);
    } else if (!blooddonation) {
      return res.status(404).send({
        message: 'No Blooddonation with that identifier has been found'
      });
    }
    req.blooddonation = blooddonation;
    next();
  });
};
