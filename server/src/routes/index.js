const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const collegeRoutes = require('./collegeRoutes');
const courseRoutes = require('./courseRoutes');
const predictionRoutes = require('./predictionRoutes');
const favouriteRoutes = require('./favouriteRoutes');
const guidanceRoutes = require('./guidanceRoutes');
const adminRoutes = require('./adminRoutes');

// Root health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'AdmitWise API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/colleges', collegeRoutes);
router.use('/courses', courseRoutes);
router.use('/predictions', predictionRoutes);
router.use('/favourites', favouriteRoutes);
router.use('/guidance', guidanceRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
