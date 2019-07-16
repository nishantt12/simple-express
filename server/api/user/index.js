'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

router.get('/', controller.index);
router.get('/:id', controller.show);

router.delete('/:id', controller.destroy);
router.delete('/', controller.deleteAll);


router.get('/me/:id', auth.isAuthenticated(), controller.getMe);
router.post('/', controller.create);
router.post('/exists', controller.userExists);
router.post('/valid', controller.userValidation);

router.post('/otp/verify', controller.verifyOtp);
router.post('/otp/resend', controller.resendOtp);
router.post('/otp', controller.createPhoneOtp);
router.post('/login', controller.login);

router.post('/follow', controller.follow);


module.exports = router;
