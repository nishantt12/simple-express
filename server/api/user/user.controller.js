'use strict';

var _ = require('lodash');
var User = require('./user.model');


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
