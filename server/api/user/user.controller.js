'use strict';

var _ = require('lodash');
var User = require('./user.model.js');
var config = require('../../config/environment');
var _ = require('lodash');
var Promise = require('bluebird');


var Errors = require('../../error');
var Success = require('../../responses');



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
    if (err) {
      return handleError(res, err);
    }
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
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      return res.status(404).end();
    }
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
  if (req.body._id) {
    delete req.body._id;
  }
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      return res.status(404).end();
    }
    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
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
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      return res.status(404).end();
    }
    user.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
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
    if (err) {
      return handleError(res, err);
    }
    return res.status(204).send(numberRemoved + " Users removed");
  })
};


exports.create = function (req, res) {
  console.log("create!!")

  User.create(req.body, function (err, user) {
    if (err) {
      Success.errorResponse(res, "unable to signup user", 500, "unable to signup user")
    }
    else {
      Success.successResponse(res, user, 200)
    }

  })


};

