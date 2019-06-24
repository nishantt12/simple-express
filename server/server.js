'use strict';

var express = require('express');
var chalk = require('chalk');
var config = require('./config/environment');
var mongoose = require('mongoose');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger/swagger.json');

mongoose.connect(config.mongo.uri, config.mongo.options);

var app = express();
var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log("env: "+process.env.NODE_ENV+"  "+app.get('env'));

server.listen(config.port, config.ip, function () {

  console.log(
    chalk.red('\nExpress server listening on port ')
    + chalk.yellow('%d')
    + chalk.red(', in ')
    + chalk.yellow('%s')
    + chalk.red(' mode.\n'),
    config.port,
    app.get('env')
  );

  if (config.env === 'development') {
    require('ripe').ready();
  }

});

module.exports = server;
