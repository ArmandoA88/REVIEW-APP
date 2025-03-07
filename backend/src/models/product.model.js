const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    amazonAsin: {
        type: String,
        required: [true, 'Amazon ASIN is required'],
        trim: true,
        maxlength: [20, 'Amazon ASIN cannot exceed 20 characters']
    },
    walmartId: {
        type: String,
        required: [true, 'Walmart Product ID is required'],
        trim: true,
        maxlength: [20, 'Walmart Product ID cannot exceed 20 characters']
    },
    ebayId: {
        type: String,
        trim: true,
        maxlength: [20, 'eBay Product ID cannot exceed 20 characters']
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt field on save
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
