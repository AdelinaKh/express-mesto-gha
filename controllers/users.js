const User = require('../models/user');
//возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
      .then((user) => {
        res.status(200).send({ data: user });
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
//возвращает пользователя по _id
const getUsersById = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    }
    res.status(200).send(user);
  })
    .catch((err) => {
      if(err.name === 'CastError') {
         res.status(400).send({ message: 'Переданы некорректные данные' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}
//создаёт пользователя
const createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then((users) => {
    res.status(200).send({ data: users })
  })
  .catch((err) => {
    if(err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
    }
    return res.status(500).send({ message: 'Произошла ошибка' })
  });
}
//обновляет профиль
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
  .then((user) => {
    if(!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' })
    }
    return res.status(200).send({ data: user })
  })
  .catch((err) => {
    if(err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при редактировании профиля' })
    }
    return res.status(500).send({ message: 'Произошла ошибка' })
  });
}
//обновляет аватар
const updateUserAvatar = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true })
  .then((user) => {
    if(!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' })
    }
    return res.status(200).send({ data: user })
  })
  .catch((err) => {
    if(err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при редактировании аватара' })
    }
    return res.status(500).send({ message: 'Произошла ошибка' })
  });
}

module.exports = {
  getUsers,
  getUsersById,
  createUsers,
  updateUserProfile,
  updateUserAvatar
}