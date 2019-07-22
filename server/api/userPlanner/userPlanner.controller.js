'use strict';

var _ = require('lodash');
var UserPlanner = require('../models/userPlanner.model');

var Planner = require('../planner');
var Promise = require('bluebird');

var Errors = require('../../error');
var Success = require('../../responses');


var Planner = require('../planner/planner.controller');

var date = new Date();
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];



function handleError(res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of UserPlanner
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  UserPlanner.find(function (err, UserPlanners) {
    if (err) { return handleError(res, err); }

    return Success.successResponse(res, UserPlanners, 200);
    // return res.status(200).json();
  });
};

/**
 * Get a single UserPlanner
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
  UserPlanner.findById(req.params.id, function (err, UserPlanner) {
    if (err) { return handleError(res, err); }
    if (!UserPlanner) { return res.status(404).end(); }
    return res.status(200).json(UserPlanner);
  });
};

/**
 * Creates a new UserPlanner in the DB.
 *
 * @param req
 * @param res
 */

exports.create = function (req) {
  Planner.getDefault(function (planner) {
    // console.log("planner: " + planner);
    createPlan(4, planner);
  })
};

/**
 * Updates an existing UserPlanner in the DB.
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  UserPlanner.findById(req.params.id, function (err, UserPlanner) {
    if (err) { return handleError(res, err); }
    if (!UserPlanner) { return res.status(404).end(); }
    var updated = _.merge(UserPlanner, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(UserPlanner);
    });
  });
};

/**
 * Deletes a UserPlanner from the DB.
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
  UserPlanner.findById(req.params.id, function (err, UserPlanner) {
    if (err) { return handleError(res, err); }
    if (!UserPlanner) { return res.status(404).end(); }
    UserPlanner.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).end();
    });
  });
};


/**
 * Deletes a UserPlanner from the DB.
 *
 * @param req
 * @param res
 */
exports.deleteAll = function (req, res) {
  UserPlanner.remove({}, function (err, numberRemoved) {
    if (err) { return handleError(res, err); }
    return res.status(204).send(numberRemoved + " UserPlanners removed");
  })
};


function createPlan(weeksCount, planner) {
  var userPlanner = {};
  userPlanner.name = planner.name;
  userPlanner.start_date = date;
  userPlanner.weeksCount = weeksCount;

  var weeks = [];
  for (var i = 0; i < weeksCount; i++) {

    var date = new Date();
    var week = {};
    date.setDate(date.getDate() + (i * 7));
    week.date = date;
    week.plan = planner.plan;
    weeks.push(week);
    console.log(date);
  }
  userPlanner.weeks = weeks;

  userPlanner.end_date = date;
  UserPlanner.create(userPlanner, function (err, Planner) {



    if (err) { console.log(err) }
    else {
      console.log(Planner);
    }

  });

}




function isWeekend(date) {
  return date.getDay() == 6 || date.getDay() == 0;
}
