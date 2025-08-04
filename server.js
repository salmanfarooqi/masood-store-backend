const express = require('express');
const app = express();
const db = require('./models');
const authRouter = require('./routes/admin/auth/auth');
const categoryRouter = require('./routes/admin/categories/category');
const productRouter = require('./routes/admin/products/product');
const orderRouter = require('./routes/admin/orders/order');
const analyticsRouter = require('./routes/admin/analytics/analytics');
const { authenticateToken } = require('./midleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { buyerauthRouter } = require('./routes/buyer/auth/auth');
const { cartRouter } = require('./routes/buyer/cart/cart');
const { guestCartRouter } = require('./routes/buyer/cart/guestCart');
const cors = require('cors');
const BuyerCategoryRouter = require('./routes/buyer/categories/category');
const buyerProductRouter = require('./routes/buyer/products/product');
const buyerPaymentRouter=require('./routes/buyer/payments/payment')
const buyerOrderRouter=require('./routes/buyer/orders/order');
const guestOrderRouter=require('./routes/buyer/orders/guestOrder');
const wishlistRouter = require('./routes/buyer/wishlist/wishlist');
const { getUser } = require('./controllers/buyer/auth/auth');

// Import collection and review routes
const adminCollectionRouter = require('./routes/admin/collections/collection');
const adminReviewRouter = require('./routes/admin/reviews/review');
const buyerCollectionRouter = require('./routes/buyer/collections/collection');
const buyerReviewRouter = require('./routes/buyer/reviews/review');
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
    database: process.env.DB_HOST ? 'configured' : 'not configured'
  });
});

// Enhanced health check route for serverless
app.get('/health', async (req, res) => {
  try {
    // Test database connection with timeout
    const connectionTest = await Promise.race([
      db.sequelize.authenticate(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]);
    
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
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
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwtru703l',
      api_key: process.env.CLOUDINARY_API_KEY || '964741116272599',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'QckGC-axVOaemElOzmt50-rDepA'
    });
    console.log('Cloudinary configured successfully');
  } catch (error) {
    console.error('Cloudinary configuration failed:', error);
  }
};

setupCloudinary();

// Set up Cloudinary storage for multer with error handling
let storage, videoStorage, upload, uploadVideo;

try {
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
} catch (error) {
  console.error('Multer storage configuration failed:', error);
}

// Route to handle image upload with error handling
app.post('/upload', (req, res, next) => {
  if (!upload) {
    return res.status(500).json({ error: 'Upload service not configured' });
  }
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: 'File upload failed', details: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded!' });
    }
    
    res.json({
      message: 'File uploaded successfully!',
      url: req.file.path
    });
  });
});

// Route to handle video upload with error handling
app.post('/upload-video', (req, res, next) => {
  if (!uploadVideo) {
    return res.status(500).json({ error: 'Video upload service not configured' });
  }
  
  uploadVideo.single('video')(req, res, (err) => {
    if (err) {
      console.error('Video upload error:', err);
      return res.status(400).json({ error: 'Video upload failed', details: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video uploaded!' });
    }
    
    res.json({
      message: 'Video uploaded successfully!',
      url: req.file.path
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

// Enhanced global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Handle specific error types
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Database connection error',
      message: 'Service temporarily unavailable'
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token'
    });
  }
  
  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Enhanced server startup for different environments
const startServer = async () => {
  try {
    // Test database connection first
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Only sync database in development
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync();
      console.log('Database synced successfully.');
    }
    
    // Start server only in development
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
      });
    }
  } catch (error) {
    console.error("Server startup failed:", error);
    
    // In development, still start server even if database fails
    if (process.env.NODE_ENV === 'development') {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (database connection failed).`);
      });
    }
  }
};

// Start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

// Export for serverless
module.exports = app;
