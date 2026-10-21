const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');

router.get('/', collegeController.getColleges);
router.get('/featured', collegeController.getFeaturedColleges);
router.get('/cities', collegeController.getCities);
router.post('/compare', collegeController.compareColleges);
router.get('/:id', collegeController.getCollegeById);

module.exports = router;
