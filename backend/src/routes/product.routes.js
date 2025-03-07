const express = require('express');
const productController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Protected routes - require authentication
router.use(authController.protect);

// Admin/Editor routes - require specific roles
router.use(authController.restrictTo('admin', 'editor'));
router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Admin-only routes
router.use(authController.restrictTo('admin'));
router.delete('/:id/hard', productController.hardDeleteProduct);

module.exports = router;
