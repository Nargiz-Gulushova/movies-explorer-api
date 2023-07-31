const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { VALIDATION_EMAIL_ERROR, UNAUTH_ERROR } = require('../utils/config');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: VALIDATION_EMAIL_ERROR,
      },
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function compare(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized(UNAUTH_ERROR));
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized(UNAUTH_ERROR));
          }
          return user;
        });
    });
};

module.exports = model('user', userSchema);
