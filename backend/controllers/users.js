const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const { NODE_ENV, JWT_SECRET } = require('../config');

const { ValidationError, CastError } = mongoose.Error;

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
    } if (err instanceof ValidationError) {
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

const updateInfo = async (req, res, next, info) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      info,
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
    if (err instanceof ValidationError) {
      return next(new BadRequestError('Переданные данные некорректны'));
    }
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const info = { name: req.body.name, about: req.body.about };
  updateInfo(req, res, next, info);
};

const updateAvatar = async (req, res, next) => {
  const info = { avatar: req.body.avatar };
  updateInfo(req, res, next, info);
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
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next, userId) => {
  try {
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
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    return getUser(req, res, next, userId);
  } catch (err) {
    if (err instanceof CastError) {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const getUserData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    return getUser(req, res, next, userId);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createUser, getUserById, getUsers, updateProfile, updateAvatar, login, getUserData,
};
