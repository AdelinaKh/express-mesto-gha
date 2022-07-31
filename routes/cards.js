const router = require('express').Router();
const {
  getCards,
  deleteCardsById,
  createCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', deleteCardsById);
router.post('/cards', createCards);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
