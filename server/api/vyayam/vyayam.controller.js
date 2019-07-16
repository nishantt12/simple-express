'use strict';

var _ = require('lodash');
var Vyayam = require('../models/vyayam.model');
var Promise = require('bluebird');

var Errors = require('../../error');
var Success = require('../../responses');



function handleError(res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of Vyayam
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Vyayam.find(function (err, Vyayams) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(Vyayams);
  });
};

/**
 * Get a single Vyayam
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
  Vyayam.findById(req.params.id, function (err, Vyayam) {
    if (err) { return handleError(res, err); }
    if (!Vyayam) { return res.status(404).end(); }
    return res.status(200).json(Vyayam);
  });
};

/**
 * Creates a new Vyayam in the DB.
 *
 * @param req
 * @param res
 */

exports.create = function (req, res) {
  Vyayam.create(req.body, function (err, vyayam) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(vyayam);
  });
};

/**
 * Updates an existing Vyayam in the DB.
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Vyayam.findById(req.params.id, function (err, Vyayam) {
    if (err) { return handleError(res, err); }
    if (!Vyayam) { return res.status(404).end(); }
    var updated = _.merge(Vyayam, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(Vyayam);
    });
  });
};

/**
 * Deletes a Vyayam from the DB.
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
  Vyayam.findById(req.params.id, function (err, Vyayam) {
    if (err) { return handleError(res, err); }
    if (!Vyayam) { return res.status(404).end(); }
    Vyayam.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).end();
    });
  });
};


/**
 * Deletes a Vyayam from the DB.
 *
 * @param req
 * @param res
 */
exports.deleteAll = function (req, res) {
  Vyayam.remove({}, function (err, numberRemoved) {
    if (err) { return handleError(res, err); }
    return res.status(204).send(numberRemoved + " Vyayams removed");
  })
};


