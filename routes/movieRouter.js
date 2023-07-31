const movieRouter = require('express').Router();
const { getMovies, saveMovie, deleteMovie } = require('../controllers/movieController');
const { validateMovieId, validateNewMovie } = require('../utils/validations');

movieRouter.get('/', getMovies);
movieRouter.post('/', validateNewMovie, saveMovie);
movieRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movieRouter;
