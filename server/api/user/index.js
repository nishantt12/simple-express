'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

router.get('/', controller.index);
router.get('/:id', controller.show);

// router.post('/', controller.create);

// router.put('/:id', controller.update);

router.delete('/:id', controller.destroy);
router.delete('/delete/deleteAll', controller.deleteAll);


router.get('/me/:id', auth.isAuthenticated(), controller.getMe);
router.post('/create', controller.create);
router.post('/userExists', controller.userExists);
router.post('/userValidation', controller.userValidation);

router.post('/verifyOtp', controller.verifyOtp);
router.post('/resendOtp', controller.resendOtp);
router.post('/createOtp', controller.createPhoneOtp);
router.post('/login', controller.login);

module.exports = router;
