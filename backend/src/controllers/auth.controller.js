const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Create a JWT token
 * @param {string} id - User ID
 * @returns {string} - JWT token
 */
const signToken = id => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

/**
 * Create and send a JWT token
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    // Remove password from output
    user.password = undefined;
    
    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user
        }
    });
};

/**
 * Register a new user
 */
exports.register = catchAsync(async (req, res, next) => {
    // Check if user already exists
    const existingUser = await User.findOne({ 
        $or: [
            { email: req.body.email },
            { username: req.body.username }
        ]
    });
    
    if (existingUser) {
        return next(new AppError('User with this email or username already exists', 400));
    }
    
    // Create new user
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || 'viewer' // Default to viewer role
    });
    
    createSendToken(newUser, 201, res);
});

/**
 * Login user
 */
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    
    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    
    // If everything ok, send token to client
    createSendToken(user, 200, res);
});

/**
 * Protect routes - middleware to check if user is authenticated
 */
exports.protect = catchAsync(async (req, res, next) => {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    
    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please log in again.', 401));
    }
    
    // Grant access to protected route
    req.user = currentUser;
    next();
});

/**
 * Restrict to certain roles - middleware to check if user has required role
 * @param {...string} roles - Roles that are allowed
 * @returns {Function} - Express middleware
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array ['admin', 'editor']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        
        next();
    };
};

/**
 * Get current user
 */
exports.getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            user: req.user
        }
    });
});

/**
 * Update password
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    
    // Check if current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is incorrect', 401));
    }
    
    // Update password
    user.password = req.body.newPassword;
    await user.save();
    
    // Log user in, send JWT
    createSendToken(user, 200, res);
});
