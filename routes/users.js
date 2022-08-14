const router = require('express').Router();
const {
  getUsers,
  getUsersById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', getUsersById);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
