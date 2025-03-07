const express = require('express');
const submissionController = require('../controllers/submission.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.post('/', submissionController.createSubmission);

// Protected routes - require authentication
router.use(authController.protect);

// Admin/Editor routes - require specific roles
router.use(authController.restrictTo('admin', 'editor', 'viewer'));
router.get('/', submissionController.getAllSubmissions);
router.get('/stats', submissionController.getSubmissionStats);
router.get('/export/csv', submissionController.exportSubmissionsCSV);
router.get('/:id', submissionController.getSubmission);

// Admin-only routes
router.use(authController.restrictTo('admin'));
router.delete('/:id', submissionController.deleteSubmission);

module.exports = router;
