'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./signup.controller');


router.get('/me', auth.isAuthenticated(), controller.getMe);
router.post('/create', controller.create);
router.post('/userExists', controller.userExists);
router.post('/verifyOtp', controller.verifyOtp);
router.post('/resendOtp', controller.resendOtp);
router.post('/createOtp', controller.createOtp);
router.post('/login', controller.login);


module.exports = router;
