const Card = require('../models/card');

// const NotAuthorized = require('../errors/NotAuthorized');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
// const Default = require('../errors/Default');
// const Conflict = require('../errors/Conflict');
const Forbidden = require('../errors/Forbidden');

// возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};
// удаляет карточку по идентификатору
const deleteCardsById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена');
      } else if (!card.owner.equals(req.user._id)) {
        throw new Forbidden('Попытка удалить чужую карточку');
      } else {
        return card.remove()
          .then(() => res.status(200).send(card));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
};
// создаёт карточку
const createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};
// поставить лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при постановки лайка');
      }
    })
    .catch(next);
};
// убрать лайк с карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при постановки лайка');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  deleteCardsById,
  createCards,
  likeCard,
  dislikeCard,
};
