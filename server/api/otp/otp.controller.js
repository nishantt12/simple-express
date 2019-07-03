'use strict';

//------------------------- PACKAGES---------------------------- //
var Promise = require('bluebird');
var UUID = require('node-uuid');

//-------------------------- SERVICES --------------------------//
var Errors = require('../../error');
var Success = require('../../responses');
var config = require('../../config/environment');

//--------------------------- MODELS ---------------------------//
var OTP = require('../models/otp.models');
//------------------------- PROMISES ---------------------------//
var OTPObj = Promise.promisifyAll(OTP);

var otpController;

// Save service provider name against otp
function saveServiceName(to, serviceProvider) {
  return OTP.findOneAndUpdate(
    { 'phone': to, 'check_done': false },
    { $set: { service: serviceProvider } }
  )
    .sort({ created_at: -1 })
    .exec(function (err, data) {
      if (err) console.log(err);
      return;
    })
}

otpController = {

  createOtp: function (phone, callBack) {
    var uuid = UUID.v1();
    var token = uuid.substring(0, 4);
    OTPObj.createAsync(
      {
        'phone': phone,
        'token': token,
        'verified_user': false
      }
    )
      .then(function (otp) {
        callBack(token);
      });
  },

  createPhoneOtp: function (req, res, phone) {
    var uuid = UUID.v1();
    var token = uuid.substring(0, 4);
    OTPObj.createAsync(
      {
        'phone': phone,
        'token': token,
        'verified_user': false
      }
    )
      .then(function (otp) {
        return Success.successResponse(res, { otp: otp.token }, 200);
      });
  },

  resendOtp: function (req, res, phone) {
    OTPObj.findOneAndUpdate(
      { 'phone': phone, 'check_done': false },
      { $inc: { 'resend': 1 } }
    )
      .sort({ 'created_at': -1 })
      .exec()
      .then(function (otp) {

        if (!otp) return Errors.errorDBNotFound(res, 'Otp');
        console.log(otp.token);
        return Success.successResponse(res, { otp: otp.token }, 200);
      })
      .catch(function (err) {

        return Errors.errorDB(res, err);
      });
  },

  updateServiceName: function (req, res, phone, serviceName) {
    try {
      saveServiceName(phone, serviceName);
      return Success.successResponse(res, {}, 200);
    } catch (err) {
      return Success.errorResponse(res, err, 500, error);
    }
  }

}

/**
 * Verifies and deletes verified otp's.
 * @param  {String} mobile
 * @param  {String} otpClaim
 * @return {Boolean} true if verified, false otherwise.
 */
otpController.verifyOtpPromise = function (mobile, otpClaim) {
  return new Promise(function (resolve, reject) {
    OTP.findOne(
      {
        'phone': mobile,
        'token': otpClaim,
        'check_done': false
      },
      function (err, otp) {
        if (err) return reject(err);
        if (!otp) return resolve(false);
        OTP.update(
          {
            'phone': mobile,
            'token': otpClaim,
            'check_done': false,
          },
          {
            $set: { 'check_done': true },
            'updated_at': new Date()
          },
          function (data) {
          });
        return resolve(true);
      });
  });
};

module.exports = otpController;
