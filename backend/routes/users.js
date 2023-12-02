const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateProfile, updateAvatar, getUserData,
} = require('../controllers/users');
const regex = require('../utils/regex');

const userRouter = Router();

userRouter.get('/me', getUserData);
userRouter.get('/', getUsers);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
}), updateAvatar);

module.exports = userRouter;
