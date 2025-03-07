const Promotion = require('../models/promotion.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all promotions
exports.getAllPromotions = catchAsync(async (req, res, next) => {
    const promotions = await Promotion.find({ active: true });
    
    res.status(200).json({
        success: true,
        count: promotions.length,
        data: promotions
    });
});

// Get a single promotion
exports.getPromotion = catchAsync(async (req, res, next) => {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
        return next(new AppError('Promotion not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: promotion
    });
});

// Create a new promotion
exports.createPromotion = catchAsync(async (req, res, next) => {
    const promotion = await Promotion.create(req.body);
    
    res.status(201).json({
        success: true,
        data: promotion
    });
});

// Update a promotion
exports.updatePromotion = catchAsync(async (req, res, next) => {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if (!promotion) {
        return next(new AppError('Promotion not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: promotion
    });
});

// Delete a promotion (soft delete)
exports.deletePromotion = catchAsync(async (req, res, next) => {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, { active: false }, {
        new: true
    });
    
    if (!promotion) {
        return next(new AppError('Promotion not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: null
    });
});

// Hard delete a promotion (for admin only)
exports.hardDeletePromotion = catchAsync(async (req, res, next) => {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    
    if (!promotion) {
        return next(new AppError('Promotion not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: null
    });
});
