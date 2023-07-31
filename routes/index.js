const appRouter = require('express').Router();
const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');
const { NOT_FOUND_ERROR } = require('../utils/config');
const authRouter = require('./authRouter');
const movieRouter = require('./movieRouter');
const userRouter = require('./userRouter');

appRouter.use(authRouter);

appRouter.use('/movies', auth, movieRouter);
appRouter.use('/users', auth, userRouter);

appRouter.use('*', auth, (req, res, next) => next(new NotFound(NOT_FOUND_ERROR)));

module.exports = appRouter;
