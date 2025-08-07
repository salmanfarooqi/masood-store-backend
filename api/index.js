const express = require('express');
const app = express();

// Load environment variables first
require('dotenv').config();

// Basic middleware setup
const cors = require('cors');

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

// Global state for initialization
let initializationState = {
  database: 'not_started',
  routes: 'not_started',
  cloudinary: 'not_started',
  errors: [],
  pgCheck: 'not_checked'
};

let db = null;

// Check if pg package is available
const checkPgPackage = () => {
  try {
    initializationState.pgCheck = 'checking';
    const pg = require('pg');
    console.log('pg package found:', pg.version || 'version unknown');
    initializationState.pgCheck = 'available';
    return true;
  } catch (error) {
    console.error('pg package check failed:', error.message);
    initializationState.pgCheck = 'missing';
    initializationState.errors.push(`pg package: ${error.message}`);
    return false;
  }
};

// Basic health check route (no database dependency)
app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to Express API",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    status: 'running',
    initialization: initializationState
  });
});

// Test route to check if server is working
app.get('/test', (req, res) => {
  res.json({ 
    message: "Server is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    initialization: initializationState
  });
});

// Simple API test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: 'healthy',
    initialization: initializationState
  });
});

// Package check endpoint
app.get('/packages', (req, res) => {
  const packageStatus = {
    pg: 'unknown',
    sequelize: 'unknown',
    express: 'available',
    cors: 'available'
  };

  try {
    require('pg');
    packageStatus.pg = 'available';
  } catch (e) {
    packageStatus.pg = 'missing: ' + e.message;
  }

  try {
    require('sequelize');
    packageStatus.sequelize = 'available';
  } catch (e) {
    packageStatus.sequelize = 'missing: ' + e.message;
  }

  res.json({
    packages: packageStatus,
    node_version: process.version,
    platform: process.platform,
    arch: process.arch
  });
});

// Detailed health check route
app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    routes: initializationState.routes,
    database: initializationState.database,
    cloudinary: initializationState.cloudinary,
    pgCheck: initializationState.pgCheck,
    errors: initializationState.errors
  };

  // Test database connection if available
  if (db && initializationState.database === 'initialized') {
    try {
      await Promise.race([
        db.sequelize.authenticate(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout')), 5000)
        )
      ]);
      
      healthStatus.database_connection = 'connected';
      
      // Test Product model if available
      if (db.product) {
        try {
          const productCount = await db.product.count();
          healthStatus.product_count = productCount;
          healthStatus.product_model = 'available';
        } catch (error) {
          healthStatus.product_model = 'error: ' + error.message;
        }
      }
      
      healthStatus.available_models = Object.keys(db).filter(key => 
        key !== 'sequelize' && key !== 'Sequelize' && key !== 'healthCheck' && key !== 'closeConnection'
      );
      
    } catch (error) {
      console.error('Health check database test failed:', error);
      healthStatus.database_connection = 'failed';
      healthStatus.database_error = error.message;
      healthStatus.status = 'degraded';
    }
  } else {
    healthStatus.database_connection = 'not_available';
    if (initializationState.database !== 'initialized') {
      healthStatus.status = 'degraded';
    }
  }

  res.json(healthStatus);
});

// Database connection status route
app.get('/db-status', async (req, res) => {
  if (!db) {
    return res.status(503).json({ 
      status: 'disconnected',
      error: 'Database not initialized',
      initialization_state: initializationState.database,
      pg_check: initializationState.pgCheck
    });
  }

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

// Initialize database with proper error handling
const initializeDatabase = () => {
  try {
    console.log('Starting database initialization...');
    initializationState.database = 'initializing';
    
    // Check if pg package is available first
    if (!checkPgPackage()) {
      throw new Error('pg package is not available');
    }
    
    db = require('../models');
    console.log('Database models loaded successfully');
    initializationState.database = 'initialized';
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    initializationState.database = 'failed';
    initializationState.errors.push(`Database: ${error.message}`);
    return false;
  }
};

// Initialize routes with proper error handling
const initializeRoutes = () => {
  try {
    console.log('Starting routes initialization...');
    initializationState.routes = 'initializing';
    
    // Import routes with individual error handling
    const authRouter = require('../routes/admin/auth/auth');
    const categoryRouter = require('../routes/admin/categories/category');
    const productRouter = require('../routes/admin/products/product');
    const orderRouter = require('../routes/admin/orders/order');
    const analyticsRouter = require('../routes/admin/analytics/analytics');
    const { authenticateToken } = require('../midleware');
    const { buyerauthRouter } = require('../routes/buyer/auth/auth');
    const { cartRouter } = require('../routes/buyer/cart/cart');
    const { guestCartRouter } = require('../routes/buyer/cart/guestCart');
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

    // Setup routes
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
    app.use('/buyer', guestCartRouter);
    app.use('/buyer', guestOrderRouter);
    app.use('/buyer', authenticateToken, cartRouter);
    app.use('/buyer', authenticateToken, buyerPaymentRouter);
    app.use('/buyer', authenticateToken, buyerOrderRouter);
    app.use('/buyer/wishlist', authenticateToken, wishlistRouter);
    app.use('/buyer/profile', authenticateToken, getUser);
    
    initializationState.routes = 'initialized';
    console.log('Routes setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up routes:', error);
    initializationState.routes = 'failed';
    initializationState.errors.push(`Routes: ${error.message}`);
    return false;
  }
};

// Initialize Cloudinary with error handling
const initializeCloudinary = () => {
  try {
    console.log('Starting Cloudinary initialization...');
    initializationState.cloudinary = 'initializing';
    
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: 'dwtru703l',
      api_key: '964741116272599',
      api_secret: 'QckGC-axVOaemElOzmt50-rDepA'
    });
    
    initializationState.cloudinary = 'initialized';
    console.log('Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('Cloudinary configuration failed:', error);
    initializationState.cloudinary = 'failed';
    initializationState.errors.push(`Cloudinary: ${error.message}`);
    return false;
  }
};

// Run initialization synchronously
console.log('Starting serverless function initialization...');

// Initialize Cloudinary first (least likely to fail)
initializeCloudinary();

// Initialize database
const dbInitialized = initializeDatabase();

// Initialize routes (depends on database for some middleware)
const routesInitialized = initializeRoutes();

console.log(`Initialization complete - DB: ${dbInitialized}, Routes: ${routesInitialized}, Cloudinary: ${initializationState.cloudinary}`);

// Global error handler for serverless
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
    initialization: initializationState
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    available_routes: initializationState.routes === 'initialized' ? 'Routes are available' : 'Routes not initialized'
  });
});

// Export the Express app for Vercel
module.exports = app;