const { Router } = require('express');
const { createUser, login } = require('../controllers/users');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { signInValidation, signUpValidation } = require('../utils/reqValidation');

const router = Router();

router.post('/signin', signInValidation, login);
router.post('/signup', signUpValidation, createUser);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
