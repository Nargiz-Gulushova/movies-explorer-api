const { ValidationError } = require('mongoose').Error;
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const Movie = require('../models/movieSchema');
const {
  STATUS_SUCCESS_CREATED, BAD_REQUEST_ERROR, NOT_FOUND_ERROR, FORBIDDEN_ERROR,
} = require('../utils/config');

function getMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
}

function saveMovie(req, res, next) {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((newMovie) => res.status(STATUS_SUCCESS_CREATED).send({ data: newMovie }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest(BAD_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params.movieId)
    .orFail(new NotFound(NOT_FOUND_ERROR))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new Forbidden(FORBIDDEN_ERROR));
      }
      return Movie.deleteOne(movie)
        .then(() => res.send({ data: movie }));
    })
    .catch(next);
}

module.exports = {
  getMovies,
  saveMovie,
  deleteMovie,
};
