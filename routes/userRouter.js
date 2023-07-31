const userRouter = require('express').Router();
const {
  patchUserData,
  getUserInfo,
} = require('../controllers/userController');
const { validatePatchUserData } = require('../utils/validations');

userRouter.get('/me', getUserInfo);
userRouter.patch('/me', validatePatchUserData, patchUserData);

module.exports = userRouter;
