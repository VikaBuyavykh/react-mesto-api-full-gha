const { Router } = require('express');
const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserData,
} = require('../controllers/users');
const { userIdValidation, changeProfileValidation, changeAvatarValidation } = require('../utils/reqValidation');

const userRouter = Router();

userRouter.get('/me', getUserData);
userRouter.get('/', getUsers);
userRouter.get('/:userId', userIdValidation, getUserById);
userRouter.patch('/me', changeProfileValidation, updateProfile);
userRouter.patch('/me/avatar', changeAvatarValidation, updateAvatar);

module.exports = userRouter;
