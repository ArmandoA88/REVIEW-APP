const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all products
exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find({ active: true });
    
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// Get a single product
exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: product
    });
});

// Create a new product
exports.createProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create(req.body);
    
    res.status(201).json({
        success: true,
        data: product
    });
});

// Update a product
exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: product
    });
});

// Delete a product (soft delete)
exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, {
        new: true
    });
    
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: null
    });
});

// Hard delete a product (for admin only)
exports.hardDeleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: null
    });
});
