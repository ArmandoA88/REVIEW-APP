const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./src/routes/product.routes');
const promotionRoutes = require('./src/routes/promotion.routes');
const submissionRoutes = require('./src/routes/submission.routes');
const authRoutes = require('./src/routes/auth.routes');

// Create Express app
const app = express();

// Set up middleware
// Updated CORS configuration for production
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com', 'https://admin.yourdomain.com', 'http://yourdomain.com', 'http://admin.yourdomain.com'] 
        : true,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security headers with appropriate settings for production
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// Logging - more concise in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // stricter in production
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Determine the correct paths for static files
// In cPanel, the paths might be different depending on your setup
const frontendPath = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, '../frontend') // Adjust this path as needed for your cPanel setup
    : path.join(__dirname, '../frontend');

const adminPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../admin') // Adjust this path as needed for your cPanel setup
    : path.join(__dirname, '../admin');

// Serve static files from the frontend directory
app.use(express.static(frontendPath));

// Serve static files from the admin directory
app.use('/admin', express.static(adminPath));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/auth', authRoutes);

// Serve frontend for all other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Connect to MongoDB with improved error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/review-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    // Don't crash the server on connection error, allow retries
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    // Close database connections, etc.
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    // Close database connections, etc.
    process.exit(0);
});

// Start server
const PORT = process.env.PORT || 8080; // cPanel often uses different ports
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
