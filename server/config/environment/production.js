'use strict';

console.log("prod.js")

module.exports = {
  ip: process.env.IP || undefined,
  mongo: {
    uri: 'mongodb://localhost/user-service'
  }
};
