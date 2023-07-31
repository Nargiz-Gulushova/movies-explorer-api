const { Joi, celebrate } = require('celebrate');
const { REG_EXP_FOR_URL_VALIDATION } = require('./config');

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

const validateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(REG_EXP_FOR_URL_VALIDATION).required(),
    trailerLink: Joi.string().pattern(REG_EXP_FOR_URL_VALIDATION).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(REG_EXP_FOR_URL_VALIDATION).required(),
    movieId: Joi.number().required(),
  }),
});

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUserSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validatePatchUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports = {
  validateMovieId,
  validateNewMovie,
  validateUserSignup,
  validateUserSignin,
  validatePatchUserData,
};
