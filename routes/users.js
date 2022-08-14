const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  AVATAR_VALIDATOR,
} = require('../utils/constants');
const {
  getUsers,
  getUsersById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUsersById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(AVATAR_VALIDATOR),
  }),
}), updateUserAvatar);

module.exports = router;
