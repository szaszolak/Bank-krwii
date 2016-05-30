'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Transfer = mongoose.model('Transfer'),
  Station = mongoose.model('Station'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Transfer
 */
exports.create = function(req, res) {
  var transfer = new Transfer(req.body);
  transfer.user = req.user;

  transfer.bloodType = req.bloodType;

  var sourceStation = Station.findById(transfer.source);
  var destinationStation = Station.findById(transfer.destination);

  transfer.state = "New";

  transfer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(transfer);
    }
  });
};

/**
 * Show the current Transfer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var transfer = req.transfer ? req.transfer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  transfer.isCurrentUserOwner = req.user && transfer.user && transfer.user._id.toString() === req.user._id.toString() ? true : false;

  var transfers = [];

  Transfer.find({state: 'New'}, function(error, users){
    if(error){

    }else{
      transfers = users;
      console.log(transfers);
    }
    
  });

  res.jsonp(transfer);
};

/**
 * Update a Transfer
 */
exports.update = function(req, res) {
  var transfer = req.transfer ;

  transfer = _.extend(transfer , req.body);


  /*switch(transfer.bloodType){
    case 'zero_minus':
      if(sourceStation.zero_minus > transfer.amount){

      }else{
        //TODO: error - amount
      }
      break;
    case 'zero_plus':
      if(sourceStation.zero_minus > transfer.amount){

      }else{
        //TODO: error - amount
      }
      break;
    case 'A_plus':
      if(sourceStation.zero_minus > transfer.amount){

      }else{
        //TODO: error - amount
      }
      break;
    case 'A_minus':
      if(sourceStation.zero_minus > transfer.amount){

      }else{
        //TODO: error - amount
      }
      break;
    case 'B_plus':
      if(sourceStation.zero_minus > transfer.amount){

      }else{
        //TODO: error - amount
      }
      break;
    case 'B_minus':
      if(sourceStation.zero_minus > transfer.amount){

      }else{
        //TODO: error - amount
      }
      break;
    case 'AB_plus':
      if(sourceStation.zero_minus > transfer.amount){

      }else{
        //TODO: error - amount
      }
      break;
    case 'AB_minus':
      if(sourceStation.zero_minus > transfer.amount){

      }else{
        //TODO: error - amount
      }
      break;
    default:
      return res.status(400).send({
          message: "Unknown blood type"
        });
  }*/

  transfer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(transfer);
    }
  });
};

/**
 * Delete an Transfer
 */
exports.delete = function(req, res) {
  var transfer = req.transfer ;

  transfer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(transfer);
    }
  });
};

/**
 * List of Transfers
 */
exports.list = function(req, res) { 
  Transfer.find({ state: "New" }).sort('-created').populate('user', 'displayName').exec(function(err, transfers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(transfers);
    }
  });
};

/**
 * Transfer middleware
 */
exports.transferByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Transfer is invalid'
    });
  }

  Transfer.findById(id).populate('user', 'displayName').exec(function (err, transfer) {
    if (err) {
      return next(err);
    } else if (!transfer) {
      return res.status(404).send({
        message: 'No Transfer with that identifier has been found'
      });
    }
    req.transfer = transfer;
    next();
  });
};
