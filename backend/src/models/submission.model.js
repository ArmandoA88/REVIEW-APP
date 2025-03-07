const mongoose = require('mongoose');
const validator = require('validator');

const submissionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required']
    },
    platform: {
        type: String,
        required: [true, 'Platform is required'],
        enum: {
            values: ['amazon', 'walmart', 'ebay'],
            message: 'Platform must be amazon, walmart, or ebay'
        }
    },
    orderNumber: {
        type: String,
        required: [true, 'Order number is required'],
        trim: true,
        maxlength: [50, 'Order number cannot exceed 50 characters']
    },
    satisfaction: {
        type: String,
        required: [true, 'Satisfaction level is required'],
        enum: {
            values: [
                'very-satisfied', 
                'somewhat-satisfied', 
                'neutral', 
                'somewhat-dissatisfied', 
                'very-dissatisfied'
            ],
            message: 'Invalid satisfaction level'
        }
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
        required: [true, 'Promotion is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    addedToMailchimp: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for formatted date
submissionSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
});

// Virtual for satisfaction text
submissionSchema.virtual('satisfactionText').get(function() {
    const satisfactionMap = {
        'very-satisfied': 'Very Satisfied',
        'somewhat-satisfied': 'Somewhat Satisfied',
        'neutral': 'Neither Satisfied Nor Dissatisfied',
        'somewhat-dissatisfied': 'Somewhat Dissatisfied',
        'very-dissatisfied': 'Very Dissatisfied'
    };
    
    return satisfactionMap[this.satisfaction] || this.satisfaction;
});

// Virtual for platform text
submissionSchema.virtual('platformText').get(function() {
    const platformMap = {
        'amazon': 'Amazon',
        'walmart': 'Walmart',
        'ebay': 'eBay'
    };
    
    return platformMap[this.platform] || this.platform;
});

// Configure the schema to include virtuals when converting to JSON
submissionSchema.set('toJSON', { virtuals: true });
submissionSchema.set('toObject', { virtuals: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
