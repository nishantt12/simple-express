'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./planner.controller');
var auth = require('../../auth/auth.service');

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);
router.delete('/', controller.deleteAll);



module.exports = router;
