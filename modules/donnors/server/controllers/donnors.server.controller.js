'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Donnor = mongoose.model('Donnor'),
  Blooddonation = mongoose.model('Blooddonation'),
  url = require('url'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var honorableAmout = 2.5;

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

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  console.log("query");
  console.log(query);


  Blooddonation.find().sort('-created').populate('donnor').exec(function(err, blooddonations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Donnor.find().sort('-created').populate('user', 'displayName').exec(function(err1, donnors) {
          if (err1) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var allDonnors = [];

            console.log("donnors.length");
            console.log(donnors.length);

            for (var i = 0; i < donnors.length; i++) {
              
              var donnorDonations = blooddonations.filter(function(element){
                return element.donnor?element.donnor._id.toString() == donnors[i]._id.toString(): ""; 
              });

              console.log("donnorDonations.length");
              console.log(donnorDonations.length);

              var sum = 0;
              for (var j = 0; j < donnorDonations.length; j++) {
                sum += donnorDonations[j].amount;
              };

              donnors[i].amount = sum;

              allDonnors.push(donnors[i]);
            };

            allDonnors = allDonnors.map(function(element){
              return {
                __v: element.__v,
                _id: element._id,
                blood_type: element.blood_type,
                created: element.created,
                name: element.name,
                pesel: element.pesel,
                surname: element.surname,
                amount: element.amount
              };
            });

            var honorableDonnorsArray = allDonnors.filter(function(element){
              return element.amount >= honorableAmout;
            });

            if(query.honorable == 'true'){
              console.log("honorableDonnorsArray");
              console.log(honorableDonnorsArray);
              res.jsonp(honorableDonnorsArray);
            } else {
              console.log("allDonnors");
              console.log(allDonnors);
              res.jsonp(allDonnors);
            }

          }
        }
      );     
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
