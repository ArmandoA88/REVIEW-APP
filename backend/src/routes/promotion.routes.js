const express = require('express');
const promotionController = require('../controllers/promotion.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.get('/', promotionController.getAllPromotions);
router.get('/:id', promotionController.getPromotion);

// Protected routes - require authentication
router.use(authController.protect);

// Admin/Editor routes - require specific roles
router.use(authController.restrictTo('admin', 'editor'));
router.post('/', promotionController.createPromotion);
router.patch('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);

// Admin-only routes
router.use(authController.restrictTo('admin'));
router.delete('/:id/hard', promotionController.hardDeletePromotion);

module.exports = router;
