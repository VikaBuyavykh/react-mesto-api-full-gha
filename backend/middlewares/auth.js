const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { NODE_ENV, JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  let payload;
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('С токеном что-то не так'));
    }
    return next(err);
  }
  req.user = payload;
  return next();
};
