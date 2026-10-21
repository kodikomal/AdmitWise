const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(requireAuth, requireAdmin);

// Dashboard overview
router.get('/dashboard', adminController.getDashboardStats);

// College management
router.get('/colleges', adminController.getAdminColleges);
router.post('/colleges', adminController.createCollege);
router.put('/colleges/:id', adminController.updateCollege);
router.delete('/colleges/:id', adminController.deleteCollege);

// Course management
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Cutoff management
router.get('/cutoffs', adminController.getAdminCutoffs);
router.post('/cutoffs', adminController.createCutoff);
router.put('/cutoffs/:id', adminController.updateCutoff);
router.delete('/cutoffs/:id', adminController.deleteCutoff);

// User management
router.get('/users', adminController.getAdminUsers);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

module.exports = router;
