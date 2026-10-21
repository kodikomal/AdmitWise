const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { predictionLimiter } = require('../middleware/rateLimiter');

// Guest or authenticated user can run prediction
router.post('/', predictionLimiter, optionalAuth, predictionController.createPrediction);

// Authenticated student routes
router.get('/history', requireAuth, predictionController.getPredictionHistory);
router.get('/:id', optionalAuth, predictionController.getPredictionById);
router.delete('/:id', requireAuth, predictionController.deletePrediction);
router.get('/:id/pdf', optionalAuth, predictionController.downloadReport);

module.exports = router;
