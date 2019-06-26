'use strict';

var _ = require('lodash');
var User = require('../models/user.model');


function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of User
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  User.find(function (err, users) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(users);
  });
};

/**
 * Get a single User
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.status(404).end(); }
    return res.status(200).json(user);
  });
};

/**
 * Creates a new User in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(user);
  });
};

/**
 * Updates an existing User in the DB.
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.status(404).end(); }
    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(user);
    });
  });
};

/**
 * Deletes a User from the DB.
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.status(404).end(); }
    user.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).end();
    });
  });
};


var external;

external = {
// create user
createUser = function createUser(user, res) {
  User.create(user, function (err, user) {
    console.log("createUser  "+err);
    if (err) {
      console.log(err);
      Success.errorResponse(res, "email already exists", 500, "email already exists");
    }
    else {
      var token = jwt.sign(
        {_id: user._id},
        config.secrets.session,
        {expiresInMinutes: 10 * 365 * 24 * 60}
      );
      createOtp(user._id, user.phone, function (otp) {
        var response = {
          'otp': otp,
          'token': token,
          'user': user
        };
        Email.welcome(user.email);
        return Success.successResponse(res, response, 200);
      });
    }
  });
},

createOtp = function createOtp(userId, phone, callBack) {


  if (!userId) return Errors.errorMissingParam(res, 'user id');
  if (!phone) return Errors.errorMissingParam(res, 'phone');

  UserObj.findOneAsync({'_id': userId})
    .then(function (user) {
        if (user) {
          // if ( isResend ) return OtpController.resendOtp( req, res, user );
          OtpController.createOtp(phone, callBack);
        }

        else return Errors.errorDBNotFound(res, 'User');
      },
      function (err) {
        console.log(err)
        Errors.errorServer(res, err);
      })
}

};  

module.exports = external;