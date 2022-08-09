const router = require('express').Router();
const {
  getUsers,
  getUsersById,
  createUsers,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users/me', getUsers);
router.get('/users/:userId', getUsersById);
router.post('/users', createUsers);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
