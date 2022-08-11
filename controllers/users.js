const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const NotAuthorized = require('../errors/NotAuthorized');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
// const Default = require('../errors/Default');
const Conflict = require('../errors/Conflict');
const NotAuthorized = require('../errors/NotAuthorized');

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest('Не указаны почта или пароль');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new NotAuthorized('Неправильные почта или пароль'));
    });
};
// возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};
// возвращает пользователя по _id
const getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
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
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((users) => {
      res.status(201).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      } else if (err.code === 11000) {
        throw new Conflict('Пользователь с таким email уже существует');
      }
    })
    .catch(next);
};
// обновляет профиль
const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при редактировании профиля');
      }
    })
    .catch(next);
};
// обновляет аватар
const updateUserAvatar = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при редактировании аватара');
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUsersById,
  createUsers,
  updateUserProfile,
  updateUserAvatar,
  login,
};
