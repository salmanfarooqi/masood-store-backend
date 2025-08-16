const express = require('express');
const app = express();

// Load environment variables first
require('dotenv').config();

// Basic middleware setup
const cors = require('cors');

// COMPLETELY PERMISSIVE CORS CONFIGURATION - FIXES ALL FRONTEND ISSUES
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-requested-with', 
    'Accept', 
    'Origin',
    'X-Requested-With',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
}));

// Additional middleware to ensure CORS headers are always set
app.use((req, res, next) => {
  // Set CORS headers for all responses
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-requested-with,Accept,Origin,X-Requested-With,Access-Control-Request-Method,Access-Control-Request-Headers,Cache-Control,Pragma');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Enable JSON body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Authorization:', req.headers.authorization ? 'Present' : 'Not present');
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

// Initialize database with proper error handling
const initializeDatabase = () => {
  try {
    initializationState.database = 'initializing';
    console.log('Initializing database...');
    
    if (!checkPgPackage()) {
      console.log('pg package not available, continuing without database...');
      initializationState.database = 'skipped';
      return false;
    }
    
    db = require('../models');
    console.log('Database models loaded successfully');
    
    initializationState.database = 'initialized';
    console.log('Database initialization completed');
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
    initializationState.routes = 'initializing';
    console.log('Initializing routes...');
    
    // Import and use routes - these should work even without database
    console.log('Loading admin routes...');
    const adminRoutes = require('../routes/admin');
    console.log('Admin routes loaded successfully');
    
    console.log('Loading buyer routes...');
    const buyerRoutes = require('../routes/buyer');
    console.log('Buyer routes loaded successfully');
    
    // Mount routes
    app.use('/admin', adminRoutes);
    app.use('/buyer', buyerRoutes);
    
    console.log('Routes mounted successfully');
    initializationState.routes = 'initialized';
    return true;
  } catch (error) {
    console.error('Routes initialization failed:', error);
    initializationState.routes = 'failed';
    initializationState.errors.push(`Routes: ${error.message}`);
    return false;
  }
};

// Cloudinary initialization
const initializeCloudinary = () => {
  try {
    initializationState.cloudinary = 'initializing';
    console.log('Initializing Cloudinary...');
    
    const cloudinary = require('cloudinary').v2;
    
    cloudinary.config({
      cloud_name: 'dwtru703l',
      api_key: '964741116272599',
      api_secret: 'QckGC-axVOaemElOzmt50-rDepA'
    });
    
    console.log('Cloudinary initialized successfully');
    initializationState.cloudinary = 'initialized';
    return true;
  } catch (error) {
    console.error('Cloudinary initialization failed:', error);
    initializationState.cloudinary = 'failed';
    initializationState.errors.push(`Cloudinary: ${error.message}`);
    return false;
  }
};

// Initialize everything
console.log('Starting application initialization...');

// Initialize database first (but continue even if it fails)
const dbInitialized = initializeDatabase();

// Initialize routes (should work even without database for basic routes)
initializeRoutes();

// Initialize Cloudinary (independent of database)
initializeCloudinary();

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
    if (initializationState.database === 'failed') {
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

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS test successful! Frontend can now access the API.',
    origin: req.headers.origin,
    method: req.method,
    timestamp: new Date().toISOString(),
    cors_enabled: true,
    headers_received: req.headers
  });
});

// Test endpoint that mimics your actual API structure
app.get('/test-categories', (req, res) => {
  res.json([
    { id: 'TEST-1', name: 'Test Category 1' },
    { id: 'TEST-2', name: 'Test Category 2' }
  ]);
});

// Upload routes
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with hardcoded values for Vercel deployment
cloudinary.config({
  cloud_name: 'dwtru703l',
  api_key: '964741116272599',
  api_secret: 'QckGC-axVOaemElOzmt50-rDepA'
});

// Set up Cloudinary storage for multer
let storage, videoStorage, upload, uploadVideo;

try {
  console.log('Setting up Cloudinary storage...');
  console.log('Cloudinary config:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? 'SET' : 'NOT SET',
    api_secret: cloudinary.config().api_secret ? 'SET' : 'NOT SET'
  });
  
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads',
      public_id: (req, file) => file.originalname.split('.')[0],
      resource_type: 'image'
    }
  });

  videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'videos',
      public_id: (req, file) => file.originalname.split('.')[0],
      resource_type: 'video'
    }
  });

  upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });
  
  uploadVideo = multer({ 
    storage: videoStorage,
    limits: {
      fileSize: 100 * 1024 * 1024 // 100MB limit for videos
    }
  });
  
  console.log('Multer storage configured successfully');
  console.log('upload middleware:', upload ? 'configured' : 'not configured');
  console.log('uploadVideo middleware:', uploadVideo ? 'configured' : 'not configured');
} catch (error) {
  console.error('Multer storage configuration failed:', error);
  console.error('Error details:', error.stack);
}

// Route to handle image upload
app.post('/upload', (req, res, next) => {
  console.log('Image upload endpoint hit');
  console.log('Request headers:', req.headers);
  
  if (!upload) {
    console.error('upload middleware not configured');
    return res.status(500).json({ error: 'Upload service not configured' });
  }
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Image upload error:', err);
      return res.status(400).json({ error: 'Image upload failed', details: err.message });
    }
    
    if (!req.file) {
      console.error('No image file in request');
      return res.status(400).json({ error: 'No image uploaded!' });
    }
    
    console.log('Image uploaded successfully:', req.file);
    res.json({
      success: true,
      url: req.file.path,
      filename: req.file.originalname,
      message: 'Image uploaded successfully!',
      type: 'image'
    });
  });
});

// Route to handle video upload
app.post('/upload-video', (req, res, next) => {
  console.log('Video upload endpoint hit');
  console.log('Request headers:', req.headers);
  console.log('Request body keys:', Object.keys(req.body || {}));
  
  if (!uploadVideo) {
    console.error('uploadVideo middleware not configured');
    return res.status(500).json({ error: 'Video upload service not configured' });
  }
  
  uploadVideo.single('video')(req, res, (err) => {
    if (err) {
      console.error('Video upload error:', err);
      return res.status(400).json({ error: 'Video upload failed', details: err.message });
    }
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No video uploaded!' });
    }
    
    console.log('Video uploaded successfully:', req.file);
    res.json({
      success: true,
      url: req.file.path,
      filename: req.file.originalname,
      message: 'Video uploaded successfully!'
    });
  });
});

// Route to handle transaction screenshot upload for guest orders
app.post('/upload-transaction-screenshot', (req, res, next) => {
  if (!upload) {
    return res.status(500).json({ error: 'Upload service not configured' });
  }
  
  upload.single('screenshot')(req, res, (err) => {
    if (err) {
      console.error('Screenshot upload error:', err);
      return res.status(400).json({ 
        success: false,
        error: 'Screenshot upload failed', 
        details: err.message 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No screenshot uploaded!' 
      });
    }
    
    res.json({
      success: true,
      message: 'Transaction screenshot uploaded successfully!',
      url: req.file.path
    });
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
          available_routes: {
        admin: ['/admin/test', '/admin/login'],
        buyer: ['/buyer/test', '/buyer/login'],
        general: ['/', '/test', '/health', '/cors-test'],
        upload: ['/upload', '/upload-video', '/upload-transaction-screenshot']
      }
  });
});

console.log('Application setup completed');

module.exports = app;