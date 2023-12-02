const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const {
      email, name, about, avatar, _id,
    } = req.body;
    const newUser = await new User({
      name, about, avatar, email, password: hash, _id,
    });
    await newUser.save();
    return res.status(201).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('Такой пользователь уже существует'));
    } if (err.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка валидации полей'));
    }
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Такого пользователя не существует');
    }
    const {
      name, about, avatar, _id,
    } = user;
    return res.status(200).send({
      name, about, avatar, _id,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      { new: true, runValidators: true },
    );
    if (user === null) {
      throw new NotFoundError('Такого пользователя не существует');
    } else {
      const {
        name, about, avatar, _id,
      } = user;
      return res.send({
        name, about, avatar, _id,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданные данные некорректны'));
    }
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );
    if (user !== null) {
      const {
        name, about, avatar, _id,
      } = user;
      return res.send({
        name, about, avatar, _id,
      });
    }
    throw new NotFoundError('Такого пользователя не существует');
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданные данные некорректны'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const {
    email, password,
  } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password').orFail(() => {
      throw new UnauthorizedError('Неправильные email или пароль');
    });
    const matched = await bcrypt.compare(String(password), user.password);
    if (!matched) {
      throw new UnauthorizedError('Неправильные email или пароль');
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};

const getUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user !== null) {
      return res.send(user);
    }
    throw new NotFoundError('Такого пользователя не существует');
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданные данные некорректны'));
    }
    return next(err);
  }
};

module.exports = {
  createUser, getUserById, getUsers, updateProfile, updateAvatar, login, getUserData,
};
