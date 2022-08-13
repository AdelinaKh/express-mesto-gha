const router = require('express').Router();
const {
  getUsers,
  getUsersById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUsersById);
// router.post('/users', createUsers);
router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
