'use strict';

//------------------------- PACKAGES---------------------------- //
// var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
var UUID = require('node-uuid');

//-------------------------- SERVICES --------------------------//
var Errors = require('../../error');
var Success = require('../../responses');
// var util = require('../../utils');
// var sms_scheduler = require('../../components/sms_scheduler');
var config = require('../../config/environment');
// var email_scheduler = require('../../components/email_scheduler');

//--------------------------- MODELS ---------------------------//
// var models = require('service-market-models');
var OTP = require('../models/otp.models');
// var CustomerUser = models.customer_user;
// var CustomerRequest = models.customer_request;
//------------------------- PROMISES ---------------------------//
var OTPObj = Promise.promisifyAll(OTP);
// var CustomerUserObj = Promise.promisifyAll(CustomerUser);

var otpController;

// Save service provider name against otp
function saveServiceName(to, serviceProvider) {
  return OTP.findOneAndUpdate(
    {'phone': to, 'check_done': false},
    {$set: {service: serviceProvider}}
  )
    .sort({created_at: -1})
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
        // if ( user.is_phone_verified ) email_scheduler.sendOtp( user.email, token );
        // sms_scheduler.otpVerificationCode( otp.token, user, saveServiceName );
        // phone = phone.split('+91 ')[1];

        callBack(token);
        // return Success.successResponse( res, { otp: token}, 200 );
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
        // if ( user.is_phone_verified ) email_scheduler.sendOtp( user.email, token );
        // sms_scheduler.otpVerificationCode( otp.token, user, saveServiceName );
        // phone = phone.split('+91 ')[1];

        return Success.successResponse(res, {otp: otp.token}, 200);
        // return Success.successResponse( res, { otp: token}, 200 );
      });
  },

  resendOtp: function (req, res, phone) {
    OTPObj.findOneAndUpdate(
      {'phone': phone, 'check_done': false},
      {$inc: {'resend': 1}}
    )
      .sort({'created_at': -1})
      .exec()
      .then(function (otp) {

        if (!otp) return Errors.errorDBNotFound(res, 'Otp');
        // sms_scheduler.otpVerificationCode( otp.token, user, saveServiceName, otp.service );
        // user.phone = user.phone.split( '+91 ' )[ 1 ];
        console.log(otp.token);
        // return res.status(200).json({otp:"1311"});
        return Success.successResponse(res, {otp: otp.token}, 200);
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
            $set: {'check_done': true},
            'updated_at': new Date()
          },
          function (data) {
          });
        return resolve(true);
      });
  });
};

module.exports = otpController;
