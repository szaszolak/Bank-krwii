'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Donnor Schema
 */
var DonnorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Donnor name',
    trim: true
  },surname: {
    type: String,
    default: '',
    required: 'Please fill Donnor name',
    trim: true
  },blood_type: {
    type: String,
    default: '',
    required: 'Please fill Donnor name',
    trim: true
  },pesel: {
    type: Number,
    default: '',
    required: 'Please fill Donnor name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Donnor', DonnorSchema);
