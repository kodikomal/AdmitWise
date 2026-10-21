const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.get('/dashboard', studentController.getDashboardData);

module.exports = router;
