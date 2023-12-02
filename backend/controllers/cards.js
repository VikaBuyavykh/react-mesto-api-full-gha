const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');

const createCard = async (req, res, next) => {
  try {
    const newCard = await new Card({
      name: req.body.name, link: req.body.link, owner: req.user._id,
    });
    await newCard.save();
    const {
      likes, _id, name, link, owner, createdAt,
    } = newCard;
    return res.status(201).send({
      likes, _id, name, link, owner, createdAt,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка валидации полей'));
    }
    return next(err);
  }
};

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card === null) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('У вас недостаточно прав, чтобы удалить пост');
    }
    await Card.findByIdAndDelete(cardId);
    return res.send({ Message: 'Пост удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const likedCard = await Card
      .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true });
    if (likedCard === null) {
      throw new NotFoundError('Карточка не найдена');
    }
    const {
      likes, _id, name, link, owner, createdAt,
    } = likedCard;
    return res.send({
      likes, _id, name, link, owner, createdAt,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const dislikedCard = await Card
      .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true });
    if (dislikedCard === null) {
      throw new NotFoundError('Карточка не найдена');
    }
    const {
      likes, _id, name, link, owner, createdAt,
    } = dislikedCard;
    return res.send({
      likes, _id, name, link, owner, createdAt,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
