'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


function roleValidation(val) {
  return val.length > 1;
}
/**
 * User Schema
 */
var UserSchema = new Schema({
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
    default: ''
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  providers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider'
    }
  ],
  roles: {
    type: [{
      type: String,
      required: 'Please provide at least one role'
    }],
    validate: [roleValidation, '{PATH} must have at least one role']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('User', UserSchema);
