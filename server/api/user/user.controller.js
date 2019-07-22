'use strict';

var _ = require('lodash');
var User = require('../models/user.model');
var FB = require('fb');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var Promise = require('bluebird');


var Errors = require('../../error');
var Success = require('../../responses');

var OtpController = require('../otp');

var UserPlanner = require('../userPlanner/userPlanner.controller');

var UserObj = Promise.promisifyAll(User);


FB.options({ 'appSecret': '' });
FB.options({ 'appId': '' });


function handleError(res, err) {
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


/**
 * Deletes a User from the DB.
 *
 * @param req
 * @param res
 */
exports.deleteAll = function (req, res) {
  User.remove({}, function (err, numberRemoved) {
    if (err) { return handleError(res, err); }
    return res.status(204).send(numberRemoved + " Users removed");
  })
};


//Signup flow
function findByEmail(email) {
  console.log("findByEmail " + email);
  return User.findOne({ 'email': email });
}

function findByPhone(phone) {
  return User.findOne({ 'phone': phone });
}

function findByUserName(username) {
  console.log("findByUserName " + username);
  return User.findOne({ 'username': username });
}

exports.getMe = function (req, res) {
  var userId = req.params.id;
  User.findOne({
    _id: userId
  }, '-salt -passwordHash', function (err, user) {
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      return res.json(401);
    }
    res.status(200).json(user);
  });
};


exports.login = function (req, res) {
  var email = req.body.email;
  var fbToken = req.body.fbToken;
  var googleToken = req.body.googleToken;
  var password = req.body.password;


  if (!email) {
    return Errors.errorMissingParam(res, 'email');
  }

  if (!fbToken && !password && !googleToken) {
    return Errors.errorMissingParam(res, 'password');
  }


  findByEmail(email)
    .then(function (user) {
      console.log(user);
      if (!user) {
        Success.errorResponse(res, "User not present", 500, "User not present");
      }
      else if (password) {
        user.Bauthenticate(password, function (err, isPassword) {
          console.log("isPassword: " + isPassword);
          if (isPassword) {
            onLoginSuccess(res, user);
          }
          else {
            Success.errorResponse(res, "Email id or Password is not correct", 500, "Email id or Password is not correct");
          }
        });

      }
      else if (googleToken) {
        verifyGoogleVerification(res, googleToken, function (success) {
          if (success) {
            onLoginSuccess(res, user);
          }
        })
      }
      else {
        verifyFbVerification(res, fbToken, function (success) {
          if (success) {
            onLoginSuccess(res, user);
          }
        })
      }
    });

};

function verifyFbVerification(res, accessToken, callBack) {
  callBack(true)
}

function verifyGoogleVerification(res, accessToken, callBack) {
  callBack(true)
}

function fbVerification(user, res, accessToken) {
  console.log('In FB verification !!!!');
  FB.setAccessToken(accessToken);
  FB.api('/me', function (data) {
    console.log('This is the data dude!!!!!', accessToken, JSON.stringify(data));

    if (data && data.error) {
      if (data.error.code === 'TIMEDOUT') {
        return Errors.errorCustom(res, 'FACEBOOK TOKEN TIMEOUT');
      } else {
        return Errors.errorCustom(res, data.error);
      }
    } else {
      user.fbId = data.id;
      user.name = data.name;
      return createUser(user, res);
    }
  });
}

function onLoginSuccess(res, user) {
  var token = jwt.sign(
    { _id: user._id },
    config.secrets.session,
    { expiresInMinutes: 10 * 365 * 24 * 60 }
  );

  console.log('this is token', token)

  var response = {
    'token': token,
    'user': user
  };
  return Success.successResponse(res,
    response
    , 200);
}

exports.userExists = function (req, res) {
  console.log("userExists");
  var email = req.body.email;
  if (!email) {
    return Errors.errorMissingParam(res, 'email');
  }

  findByEmail(email)
    .then(function (user) {
      if (!user) {
        return Success.successResponse(res, {
          'new_user': true
        }, 200);
      }
      else {
        return Success.successResponse(res, {
          'new_user': false
        }, 200);
      }
    });

};

exports.userValidation = function (req, res) {
  var email = req.body.email;
  var phone = req.body.phone;
  if (!email) {
    return Errors.errorMissingParam(res, 'email');
  }

  if (!phone) {
    return Errors.errorMissingParam(res, 'phone');
  }

  var errorMessage;
  findByEmail(email)
    .then(function (user) {
      if (user) {
        errorMessage = "email id already in use ";
      }

      findByPhone(phone)
        .then(function (userPhone) {
          if (userPhone) {
            if (errorMessage) {
              errorMessage += "and phone number already in use"
            }
            else {
              errorMessage = "phone number already in use"
            }
            Success.errorResponse(res, errorMessage, 500, errorMessage);
          }
          else if (errorMessage) {
            Success.errorResponse(res, errorMessage, 500, errorMessage);
          }
          else {
            return Success.successResponse(res, {
              'new_user': true
            }, 200);
          }
        })
    });

};

exports.create = function (req, res) {
  console.log("create!!")
  var user = req.body;

  var email = req.body.email;
  var fbToken = req.body.fbToken;
  var googleToken = req.body.googleToken;
  var username = req.body.username;
  var phone = req.body.phone;
  var password = req.body.password;


  console.log(req.body.email);


  if (!email) {
    return Errors.errorMissingParam(res, 'email');
  }


  if (!phone) {
    return Errors.errorMissingParam(res, 'phone');
  }

  if (!username) {
    return Errors.errorMissingParam(res, 'username');
  }


  if (password) {
    createUser(user, res);
  }
  else if (fbToken) {
    createUser(user, res);
  }
  else if (googleToken) {
    createUser(user, res);
  }
  else {
    return Errors.errorMissingParam(res, 'password');
  }

};


function createUser(user, res) {
  User.create(user, function (err, user) {
    if (err) {
      console.log(err);
      if ('message' in err)
        Success.errorResponse(res, err.message, 500, err.message);
      else
        Success.errorResponse(res, "unable to signup user", 500, "unable to signup user");

    }
    else {
      var token = jwt.sign(
        { _id: user._id },
        config.secrets.session,
        { expiresInMinutes: 10 * 365 * 24 * 60 }
      );
      createOtp(user._id, user.phone, function (otp) {
        var response = {
          'otp': otp,
          'token': token,
          'user': user
        };
        UserPlanner.create(user._id);
        return Success.successResponse(res, response, 200);
      });
    }
  });
}


function createOtp(userId, phone, callBack) {
  UserObj.findOneAsync({ '_id': userId })
    .then(function (user) {
      if (user) {
        OtpController.createOtp(phone, callBack);
      }

      else return Errors.errorDBNotFound(res, 'User');
    },
      function (err) {
        console.log(err)
        Errors.errorServer(res, err);
      })
}

exports.verifyOtp = function (req, res) {
  var phone = req.body.phone
  var otpClaim = req.body.otp

  if (!phone) return Errors.errorMissingParam(res, 'phone');
  if (!otpClaim) return Errors.errorMissingParam(res, 'otp');

  return OtpController.verifyOtpPromise(phone, otpClaim)
    .then(function (verified) {
      if (!verified) {
        Success.errorResponse(res, 'Incorrect otp', 500, 'Incorrect otp');
      }
      else {
        Success.successResponse(res, { message: "done" }, 200);
      }
    });

};

exports.createPhoneOtp = function (req, res) {
  var phone = req.body.phone
  return OtpController.createPhoneOtp(req, res, phone);

};

exports.resendOtp = function (req, res) {
  var phone = req.body.phone
  return OtpController.resendOtp(req, res, phone);
};

exports.editMyProfile = function (req, res) {
  var whereQuery = {}, updateQuery = {}, options = {};
  whereQuery['_id'] = req.user._id;

  console.log(req.user._id);

  User.findById(req.user._id, function (err, userDocument) {
    if (!userDocument) return handleError(res, 'No User found');
    var updated = _.merge(userDocument, req.body);

    var editedProfile = new User(updated, { _id: false });
    editedProfile.save(function (errSave, data) {
      if (errSave) {
        return handleError(res, errSave);
      }
      return httpResponse.successResponse(res, data);
    })

  })
}

exports.getMyProfile = function (req, res) {
  var whereQuery = {}, selectedOptions = {}, limit = 10, page = 0, sortBy, skip;

  if (req.params.user_id) whereQuery['_id'] = req.user._id;

  findUsersUtil(whereQuery, selectedOptions, limit, sortBy, skip, function (err, users) {
    if (err) {
      return handleError(res, err);
    }
    return httpResponse.successResponse(res, users);
  });

}

exports.getProfile = function (req, res) {
  var whereQuery = {}, selectedOptions = {}, limit = 10, page = 0, sortBy, skip;

  whereQuery['_id'] = req.params.user_id;

  findUsersUtil(whereQuery, selectedOptions, limit, sortBy, skip, function (err, users) {
    if (err) {
      return handleError(res, err);
    }
    return httpResponse.successResponse(res, users);
  });

}

function findUsersUtil(whereQuery, selectedOptions, limit, sortBy, skip, cb) {   //util for findUsers
  if (!limit) limit = 10;
  if (!sortBy) sortBy = '-created_at';
  if (!skip) skip = 0;

  User.find(whereQuery, selectedOptions).limit(limit).sort(sortBy)
    .exec(function (err, users) {
      cb(null, users)
    });
}


//social

exports.follow = function (req, res) {
  var to = req.body.to
  var from = req.body.from




}