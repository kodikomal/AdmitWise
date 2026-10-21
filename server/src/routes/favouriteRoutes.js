const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/check/:collegeId', optionalAuth, favouriteController.checkFavourite);

router.use(requireAuth);
router.get('/', favouriteController.getFavourites);
router.post('/:collegeId', favouriteController.addFavourite);
router.delete('/:collegeId', favouriteController.removeFavourite);

module.exports = router;
