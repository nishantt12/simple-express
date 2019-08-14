'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

const GENDERS = ["M", "F"];

var UserSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, lowercase: true },
  password: String,
  phone: String,
  country: String,
  state: String,
  city: String,
  pincode: String
  
});


/**
 * Virtuals
 */
UserSchema
  .virtual('password_dummy')
  .set(function (password_dummy) {
    this._password = password_dummy;
    this.salt = this.makeSalt();
    this.password = this.encryptPassword(password_dummy);
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function (password) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({ email: value }, function (err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified email address is already in use.');

// Validate email is not taken
UserSchema
  .path('phone')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({ phone: value }, function (err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified phone is already in use.');

// Validate email is not taken
UserSchema
  .path('username')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({ username: value }, function (err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified username is already in use.');

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    var user = this;
    if (user.password) {
      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash;
        console.log("hash: " + hash);
        next();
      })
    } else {
      next();
    }

  });


UserSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password']
    return ret
  }
});
/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.password;
  },


  Bauthenticate: function (password, cb) {
    bcrypt.compare(password, this.password, function (err, result) {
      console.log("compare: " + result + "  " + password + "   " + this.password)
      if (result) {
        cb(null, result)
      }
      else {
        cb(err)
      }
    })
  },
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) return '';
    bcrypt.hash(user.password, 10, function (err, hash) {
      return hash;
    })

  }
};

module.exports = mongoose.model('User', UserSchema);
