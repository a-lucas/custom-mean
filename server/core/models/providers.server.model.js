/**
 * Created by bodhi on 1/21/16.
 */
'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var ProviderSchema = new Schema({
  providerName: {
    type: String,
    trim: true,
    required: 'The provider is required'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: 'The Email is required'
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  providerId: {
    type: String,
    trim: true
  },
  profileUrl: {
    type: String,
    trim: true
  },
  credentials: Schema.Types.Mixed,
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Provider', ProviderSchema);
