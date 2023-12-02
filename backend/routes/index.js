const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const regex = require('../utils/regex');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().pattern(regex),
  }),
}), createUser);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
