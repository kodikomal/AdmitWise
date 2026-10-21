const express = require('express');
const router = express.Router();
const guidanceController = require('../controllers/guidanceController');

router.get('/', guidanceController.getGuidanceList);
router.get('/:slug', guidanceController.getGuidanceBySlug);

module.exports = router;
