'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

router.get('/', controller.index);
router.get('/:id', controller.show);

router.delete('/:id', controller.destroy);
router.delete('/', controller.deleteAll);

router.post('/', controller.create);



module.exports = router;
