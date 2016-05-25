'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Station Schema
 */
var StationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Station name',
    trim: true
  },
  addres: {
    type: String,
    default: '',
    required: 'Please fill Adres',
    trim: true
  },  
  'zero_minus': {
    type: Number,
    default: 0
  },
  'zero_plus': {
    type: Number,
    default: 0
  },
  'A_plus': {
    type: Number,
    default: 0
  },
  'A_minus': {
    type: Number,
    default: 0
  },
  'B_plus': {
    type: Number,
    default: 0
  },
  'B_minus': {
    type: Number,
    default: 0
  },
  'AB_plus': {
    type: Number,
    default: 0
  },
  'AB_minus': {
    type: Number,
    default: 0
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

mongoose.model('Station', StationSchema);
