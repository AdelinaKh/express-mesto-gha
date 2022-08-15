const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const NotAuthorized = require('../errors/NotAuthorized');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next(new NotAuthorized('Неправильные почта или пароль'));
    });
};
// возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};
// возвращает информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь с указанным _id не найден'));
        return;
      }
      res.send(user);
    })
    .catch(next);
};
// возвращает пользователя по _id
const getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь с указанным _id не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// создаёт пользователя
const createUsers = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequest('Не указаны почта или пароль');
  }
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email: req.body.email,
        password: hash, // записываем хеш в базу
      })
        .then((user) => {
          res.status(201).send({
            email: user.email,
            name: user.name,
            _id: user._id,
            about: user.about,
            avatar: user.avatar,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
          } if (err.code === 11000) {
            return next(new Conflict('Пользователь с таким email уже существует'));
          }
          return next(err);
        })
        .catch(next);
    });
};
// обновляет профиль
const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при редактировании профиля'));
      } else {
        next(err);
      }
    });
};
// обновляет аватар
const updateUserAvatar = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при редактировании аватара'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUsers,
  updateUserProfile,
  updateUserAvatar,
  login,
  getCurrentUser,
};
