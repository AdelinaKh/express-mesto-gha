const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  ERROR_NOT_AUTHORIZED,
  AVATAR_VALIDATOR,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Minimum length is 2'],
    maxlength: [30, 'Maximum length is 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Minimum length is 2'],
    maxlength: [30, 'Maximum length is 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => AVATAR_VALIDATOR.test(v),
    },
  },
  email: {
    type: String,
    required: [true, 'About is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'About is required'],
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ERROR_NOT_AUTHORIZED('Не верное имя пользователя или пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ERROR_NOT_AUTHORIZED('Не верное имя пользователя или пароль.'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
