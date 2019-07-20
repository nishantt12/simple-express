'use strict';

var _ = require('lodash');
var Planner = require('../models/planner.model');
var Promise = require('bluebird');

var Errors = require('../../error');
var Success = require('../../responses');



function handleError(res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of Planner
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Planner.find(function (err, Planners) {
    if (err) { return handleError(res, err); }

    return Success.successResponse(res, Planners, 200);
    // return res.status(200).json();
  });
};

/**
 * Get a single Planner
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
  Planner.findById(req.params.id, function (err, Planner) {
    if (err) { return handleError(res, err); }
    if (!Planner) { return res.status(404).end(); }
    return res.status(200).json(Planner);
  });
};

/**
 * Creates a new Planner in the DB.
 *
 * @param req
 * @param res
 */

exports.create = function (req, res) {
  Planner.create(req.body, function (err, Planner) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(Planner);
  });
};

/**
 * Updates an existing Planner in the DB.
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Planner.findById(req.params.id, function (err, Planner) {
    if (err) { return handleError(res, err); }
    if (!Planner) { return res.status(404).end(); }
    var updated = _.merge(Planner, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(Planner);
    });
  });
};

/**
 * Deletes a Planner from the DB.
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
  Planner.findById(req.params.id, function (err, Planner) {
    if (err) { return handleError(res, err); }
    if (!Planner) { return res.status(404).end(); }
    Planner.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).end();
    });
  });
};


/**
 * Deletes a Planner from the DB.
 *
 * @param req
 * @param res
 */
exports.deleteAll = function (req, res) {
  Planner.remove({}, function (err, numberRemoved) {
    if (err) { return handleError(res, err); }
    return res.status(204).send(numberRemoved + " Planners removed");
  })
};


