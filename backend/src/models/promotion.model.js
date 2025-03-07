const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Promotion name is required'],
        trim: true,
        maxlength: [100, 'Promotion name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Promotion description is required'],
        trim: true,
        maxlength: [500, 'Promotion description cannot exceed 500 characters']
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
promotionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
