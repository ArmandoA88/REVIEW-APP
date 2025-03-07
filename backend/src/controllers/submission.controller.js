const Submission = require('../models/submission.model');
const Product = require('../models/product.model');
const Promotion = require('../models/promotion.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const emailService = require('../services/email.service');
const mailchimpService = require('../services/mailchimp.service');

// Get all submissions
exports.getAllSubmissions = catchAsync(async (req, res, next) => {
    // Build query
    let query = Submission.find()
        .populate('product', 'name')
        .populate('promotion', 'name');
    
    // Filtering
    if (req.query.product) {
        query = query.find({ product: req.query.product });
    }
    
    if (req.query.platform) {
        query = query.find({ platform: req.query.platform });
    }
    
    if (req.query.satisfaction) {
        query = query.find({ satisfaction: req.query.satisfaction });
    }
    
    if (req.query.startDate && req.query.endDate) {
        query = query.find({
            createdAt: {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            }
        });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    // Execute query
    const submissions = await query;
    
    // Get total count for pagination
    const total = await Submission.countDocuments();
    
    res.status(200).json({
        success: true,
        count: submissions.length,
        total,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        },
        data: submissions
    });
});

// Get a single submission
exports.getSubmission = catchAsync(async (req, res, next) => {
    const submission = await Submission.findById(req.params.id)
        .populate('product', 'name')
        .populate('promotion', 'name');
    
    if (!submission) {
        return next(new AppError('Submission not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: submission
    });
});

// Create a new submission
exports.createSubmission = catchAsync(async (req, res, next) => {
    // Validate product and promotion exist
    const product = await Product.findById(req.body.product);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    
    const promotion = await Promotion.findById(req.body.promotion);
    if (!promotion) {
        return next(new AppError('Promotion not found', 404));
    }
    
    // Create submission
    const submission = await Submission.create(req.body);
    
    // Send confirmation email
    try {
        await emailService.sendConfirmationEmail({
            email: submission.email,
            name: submission.name,
            product: product.name,
            promotion: promotion.name,
            platform: submission.platform,
            reviewLink: getReviewLink(submission.platform, product)
        });
        
        // Update submission to mark email as sent
        submission.emailSent = true;
        await submission.save();
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        // We don't want to fail the submission if email fails
    }
    
    // Add to Mailchimp if newsletter opted in
    if (submission.newsletter) {
        try {
            await mailchimpService.addSubscriber({
                email: submission.email,
                name: submission.name
            });
            
            // Update submission to mark as added to Mailchimp
            submission.addedToMailchimp = true;
            await submission.save();
        } catch (error) {
            console.error('Error adding to Mailchimp:', error);
            // We don't want to fail the submission if Mailchimp fails
        }
    }
    
    res.status(201).json({
        success: true,
        data: submission
    });
});

// Delete a submission
exports.deleteSubmission = catchAsync(async (req, res, next) => {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    
    if (!submission) {
        return next(new AppError('Submission not found', 404));
    }
    
    res.status(200).json({
        success: true,
        data: null
    });
});

// Get submission statistics
exports.getSubmissionStats = catchAsync(async (req, res, next) => {
    const stats = await Submission.aggregate([
        {
            $group: {
                _id: null,
                totalCount: { $sum: 1 },
                satisfactionCounts: {
                    $push: '$satisfaction'
                },
                platformCounts: {
                    $push: '$platform'
                },
                newsletterCount: {
                    $sum: { $cond: [{ $eq: ['$newsletter', true] }, 1, 0] }
                }
            }
        }
    ]);
    
    if (stats.length === 0) {
        return res.status(200).json({
            success: true,
            data: {
                totalCount: 0,
                satisfactionDistribution: {},
                platformDistribution: {},
                newsletterPercentage: 0
            }
        });
    }
    
    // Process satisfaction distribution
    const satisfactionCounts = stats[0].satisfactionCounts.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
    
    const satisfactionDistribution = Object.keys(satisfactionCounts).reduce((acc, key) => {
        acc[key] = (satisfactionCounts[key] / stats[0].totalCount) * 100;
        return acc;
    }, {});
    
    // Process platform distribution
    const platformCounts = stats[0].platformCounts.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
    
    const platformDistribution = Object.keys(platformCounts).reduce((acc, key) => {
        acc[key] = (platformCounts[key] / stats[0].totalCount) * 100;
        return acc;
    }, {});
    
    // Calculate newsletter percentage
    const newsletterPercentage = (stats[0].newsletterCount / stats[0].totalCount) * 100;
    
    res.status(200).json({
        success: true,
        data: {
            totalCount: stats[0].totalCount,
            satisfactionDistribution,
            platformDistribution,
            newsletterPercentage
        }
    });
});

// Export submissions as CSV
exports.exportSubmissionsCSV = catchAsync(async (req, res, next) => {
    const submissions = await Submission.find()
        .populate('product', 'name')
        .populate('promotion', 'name');
    
    if (submissions.length === 0) {
        return next(new AppError('No submissions found', 404));
    }
    
    // Convert to CSV format
    const fields = [
        'ID', 'Date', 'Name', 'Email', 'Product', 'Platform', 
        'Order Number', 'Satisfaction', 'Promotion', 'Newsletter'
    ];
    
    let csv = fields.join(',') + '\n';
    
    submissions.forEach(submission => {
        const row = [
            submission._id,
            submission.createdAt.toISOString().split('T')[0],
            `"${submission.name.replace(/"/g, '""')}"`,
            submission.email,
            `"${submission.product.name.replace(/"/g, '""')}"`,
            submission.platformText,
            `"${submission.orderNumber.replace(/"/g, '""')}"`,
            submission.satisfactionText,
            `"${submission.promotion.name.replace(/"/g, '""')}"`,
            submission.newsletter ? 'Yes' : 'No'
        ];
        
        csv += row.join(',') + '\n';
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
    
    res.status(200).send(csv);
});

// Helper function to generate review links
function getReviewLink(platform, product) {
    switch (platform) {
        case 'amazon':
            return `https://www.amazon.com/review/review-your-purchases/?asin=${product.amazonAsin}`;
        case 'walmart':
            return `https://www.walmart.com/reviews/write-review?productId=${product.walmartId}`;
        case 'ebay':
            return 'https://www.ebay.com/mye/myebay/purchase'; // Generic link for eBay
        default:
            return '';
    }
}
