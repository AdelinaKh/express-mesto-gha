const express = require('express');
const { Joi, celebrate } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUsers } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const {
  AVATAR_VALIDATOR,
} = require('../utils/constants');

const app = express();

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(AVATAR_VALIDATOR),
  }),
}), createUsers);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});
module.exports = app;
