'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var OTPSchema = new Schema({
  phone: { type : String },
  token: String,
  check_done: { type: Boolean, default: false },	   // true only if otp verification done
  service: { type: String },                         // name of the service eg. twilio
  resend: { type: Number, default: 0 },              // number resend otps
  verified_user: { type: Boolean, default: false },  // true if he is old user.
  updated_at: { type: Date },
  created_at: { type: Date, default: Date.now }
});

OTPSchema.pre('save', function (next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('Otp', OTPSchema);
