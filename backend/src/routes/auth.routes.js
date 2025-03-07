const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes - require authentication
router.use(authController.protect);
router.get('/me', authController.getMe);
router.patch('/update-password', authController.updatePassword);

module.exports = router;
