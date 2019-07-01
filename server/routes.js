'use strict';

var config = require('./config/environment');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger/swagger.json');

module.exports = function (app) {

  // API
  app.use('/api/users', require('./api/user'));



  if(process.env.IP){
    swaggerDocument.host = process.env.IP+":9000";
  }
  
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  var host = process.env.IP || "localhost";

  app.use(function(req, res, next) {
    return res.status(404).send({message: 'Route'+req.url+' Not found.', reditectTo: 'http://'+host+':9000/swagger'});
  });
};
