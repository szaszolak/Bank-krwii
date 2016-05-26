'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Transfer Schema
 */
var TransferSchema = new Schema({
  source: {
    type: Number,
    default: 0,
    required: 'Please fill Bloodtransfer source',
    trim: true
  },
  destination: {
    type: Number,
    default: 0,
    required: 'Please fill Bloodtransfer destination',
    trim: true
  },
  amount: {
    type: Number,
    default: 0,
    required: 'Please fill Bloodtransfer amount',
    trim: true
  },
  bloodType: {
    type: String,
    default: 0,
    required: 'Please fill blood type',
    trim: true
  },
  state: {
    type: String,
    default: "New",
    required: 'Please fill blood type',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Transfer', TransferSchema);
