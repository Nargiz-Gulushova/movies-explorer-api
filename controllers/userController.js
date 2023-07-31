const { ValidationError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const {
  BAD_REQUEST_ERROR,
  STATUS_SUCCESS_CREATED,
  CONFLICT_DUPLICATE_CODE,
  CONFLICT_DUPLICATE_ERROR,
  TOKEN_KEY,
  PROD_MODE,
  DEV_SECRET,
  COOKIE_CONFIG,
  SUCCESS_LOGOUT_TEXT,
} = require('../utils/config');
const ConflictDuplicate = require('../errors/ConflictDuplicate');
const BadRequest = require('../errors/BadRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUserInfo(req, res, next) {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res
      .status(STATUS_SUCCESS_CREATED)
      .send({
        name: user.name,
        email: user.email,
      }))
    .catch((err) => {
      if (err.code === CONFLICT_DUPLICATE_CODE) {
        next(new ConflictDuplicate(CONFLICT_DUPLICATE_ERROR));
      } else if (err instanceof ValidationError) {
        next(new BadRequest(BAD_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  const getSecretKey = NODE_ENV === PROD_MODE
    ? JWT_SECRET
    : DEV_SECRET;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        getSecretKey,
        { expiresIn: COOKIE_CONFIG.expiresIn },
      );
      res
        .cookie(TOKEN_KEY, token, { maxAge: COOKIE_CONFIG.maxAge, httpOnly: true })
        .send({ email });
    })
    .catch(next);
};

function logout(req, res, next) {
  User.findById({ _id: req.user._id })
    .then(() => {
      res
        .clearCookie(TOKEN_KEY, { httpOnly: true })
        .send({ data: SUCCESS_LOGOUT_TEXT });
    })
    .catch(next);
}

function patchUserData(req, res, next) {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest(BAD_REQUEST_ERROR));
      } else if (err.code === CONFLICT_DUPLICATE_CODE) {
        next(new ConflictDuplicate(CONFLICT_DUPLICATE_ERROR));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUserInfo,
  createUser,
  patchUserData,
  login,
  logout,
};
