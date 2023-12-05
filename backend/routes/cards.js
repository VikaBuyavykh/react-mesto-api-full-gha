const { Router } = require('express');
const {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardIdValidation, createCardValidation } = require('../utils/reqValidation');

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', cardIdValidation, deleteCard);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.put('/:cardId/likes', cardIdValidation, likeCard);
cardRouter.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = cardRouter;
