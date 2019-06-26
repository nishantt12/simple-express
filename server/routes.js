'use strict';

var config = require('./config/environment');

module.exports = function (app) {

  // API
  app.use('/api/users', require('./api/user'));


};
