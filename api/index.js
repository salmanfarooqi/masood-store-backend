const express = require('express');
const app = express();
const db = require('../models');
const authRouter = require('../routes/admin/auth/auth');
const categoryRouter = require('../routes/admin/categories/category');
const productRouter = require('../routes/admin/products/product');
const orderRouter = require('../routes/admin/orders/order');
const analyticsRouter = require('../routes/admin/analytics/analytics');
const { authenticateToken } = require('../midleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { buyerauthRouter } = require('../routes/buyer/auth/auth');
const { cartRouter } = require('../routes/buyer/cart/cart');
const { guestCartRouter } = require('../routes/buyer/cart/guestCart');
const cors = require('cors');
const BuyerCategoryRouter = require('../routes/buyer/categories/category');
const buyerProductRouter = require('../routes/buyer/products/product');
const buyerPaymentRouter = require('../routes/buyer/payments/payment');
const buyerOrderRouter = require('../routes/buyer/orders/order');
const guestOrderRouter = require('../routes/buyer/orders/guestOrder');
const wishlistRouter = require('../routes/buyer/wishlist/wishlist');
const { getUser } = require('../controllers/buyer/auth/auth');

// Import collection and review routes
const adminCollectionRouter = require('../routes/admin/collections/collection');
const adminReviewRouter = require('../routes/admin/reviews/review');
const buyerCollectionRouter = require('../routes/buyer/collections/collection');
const buyerReviewRouter = require('../routes/buyer/reviews/review');
require('dotenv').config();

// Enhanced CORS configuration for serverless
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app', 'https://your-frontend-domain.com']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Enable JSON body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to Express API",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Test route to check if server is working
app.get('/test', (req, res) => {
  res.json({ 
    message: "Server is working!",
    timestamp: new Date().toISOString()
  });
});

// Simple API test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'configured'
  });
});

// Enhanced health check route for serverless
app.get('/health', async (req, res) => {
  try {
    // Test database connection with shorter timeout for serverless
    const connectionTest = await Promise.race([
      db.sequelize.authenticate(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]);
    
    // Test Product model
    let productCount = 0;
    let productModelStatus = 'unknown';
    
    try {
      if (db.product) {
        productCount = await db.product.count();
        productModelStatus = 'available';
      } else {
        productModelStatus = 'not_available';
      }
    } catch (error) {
      productModelStatus = 'error: ' + error.message;
    }
    
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      product_model: productModelStatus,
      product_count: productCount,
      available_models: Object.keys(db).filter(key => 
        key !== 'sequelize' && key !== 'Sequelize' && key !== 'healthCheck' && key !== 'closeConnection'
      ),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    // In serverless, return partial health status instead of 500
    res.status(200).json({ 
      status: 'degraded', 
      database: 'disconnected',
      error: error.message,
      available_models: Object.keys(db).filter(key => 
        key !== 'sequelize' && key !== 'Sequelize' && key !== 'healthCheck' && key !== 'closeConnection'
      ),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      note: 'Server is running but database connection failed'
    });
  }
});

// Database connection status route
app.get('/db-status', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ 
      status: 'connected',
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ 
      status: 'disconnected',
      error: error.message
    });
  }
});

// Setup routes with enhanced error handling
const setupRoutes = () => {
  try {
    app.use('/admin', authRouter); 
    app.use('/admin', categoryRouter);
    app.use('/admin', productRouter);
    app.use('/admin', orderRouter);
    app.use('/admin', analyticsRouter);
    app.use('/admin/collections', adminCollectionRouter);
    app.use('/admin/reviews', adminReviewRouter);

    app.use('/buyer', buyerauthRouter);
    app.use('/buyer', BuyerCategoryRouter);
    app.use('/buyer', buyerProductRouter);
    app.use('/buyer/collections', buyerCollectionRouter);
    app.use('/buyer/reviews', buyerReviewRouter);
    app.use('/buyer', guestCartRouter); // Guest cart routes (no authentication) - must come first
    app.use('/buyer', guestOrderRouter); // Guest order routes (no authentication) - must come before authenticated routes
    app.use('/buyer', authenticateToken, cartRouter);
    app.use('/buyer', authenticateToken, buyerPaymentRouter);
    app.use('/buyer', authenticateToken, buyerOrderRouter);
    app.use('/buyer/wishlist', authenticateToken, wishlistRouter);
    app.use('/buyer/profile', authenticateToken, getUser);
    
    console.log('Routes setup completed successfully');
  } catch (error) {
    console.error('Error setting up routes:', error);
    throw error;
  }
};

// Initialize routes
setupRoutes();

// Cloudinary configuration with enhanced error handling
const setupCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: 'dwtru703l',
      api_key: '964741116272599',
      api_secret: 'QckGC-axVOaemElOzmt50-rDepA'
    });
    console.log('Cloudinary configured successfully');
  } catch (error) {
    console.error('Cloudinary configuration failed:', error);
  }
};

setupCloudinary();

// Global error handler for serverless
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Export the Express app for Vercel
module.exports = app;