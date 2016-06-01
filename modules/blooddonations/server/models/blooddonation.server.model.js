'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Blooddonation Schema
 */
var BlooddonationSchema = new Schema({
  amount:{
    type: Number,
    default: 0.5
  },
  created: {
    type: Date,
    default: Date.now
  },
  station: {
    type: Schema.ObjectId,
    ref: 'Station'
  },
  donnor: {
    type: Schema.ObjectId,
    ref: 'Donnor'
  }
});

mongoose.model('Blooddonation', BlooddonationSchema);
