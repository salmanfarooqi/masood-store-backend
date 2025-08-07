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
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('Referer:', req.headers.referer);
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

// Migration endpoint to run pending migrations
app.get('/migrate', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized',
        error: 'Database connection not available'
      });
    }

    console.log('Starting migration process...');
    
    // Import Umzug for migrations
    const { Umzug, SequelizeStorage } = require('umzug');
    const path = require('path');
    
    // Create Umzug instance
    const umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, '../migrations/*.js'),
        resolve: ({ name, path, context }) => {
          const migration = require(path);
          return {
            name,
            up: async () => migration.up(context.queryInterface, context.Sequelize),
            down: async () => migration.down(context.queryInterface, context.Sequelize),
          };
        },
      },
      context: {
        queryInterface: db.sequelize.getQueryInterface(),
        Sequelize: db.Sequelize,
      },
      storage: new SequelizeStorage({
        sequelize: db.sequelize,
      }),
      logger: console,
    });

    // Check pending migrations
    const pendingMigrations = await umzug.pending();
    console.log('Pending migrations:', pendingMigrations.map(m => m.name));

    if (pendingMigrations.length === 0) {
      return res.json({
        success: true,
        message: 'No pending migrations',
        executed: [],
        pending: []
      });
    }

    // Run pending migrations
    const executedMigrations = await umzug.up();
    
    console.log('Migrations executed successfully:', executedMigrations.map(m => m.name));
    
    res.json({
      success: true,
      message: 'Migrations executed successfully',
      executed: executedMigrations.map(m => m.name),
      pending: []
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Check migration status endpoint
app.get('/migration-status', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const { Umzug, SequelizeStorage } = require('umzug');
    const path = require('path');
    
    const umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, '../migrations/*.js'),
        resolve: ({ name, path, context }) => {
          const migration = require(path);
          return {
            name,
            up: async () => migration.up(context.queryInterface, context.Sequelize),
            down: async () => migration.down(context.queryInterface, context.Sequelize),
          };
        },
      },
      context: {
        queryInterface: db.sequelize.getQueryInterface(),
        Sequelize: db.Sequelize,
      },
      storage: new SequelizeStorage({
        sequelize: db.sequelize,
      }),
      logger: console,
    });

    const executedMigrations = await umzug.executed();
    const pendingMigrations = await umzug.pending();

    res.json({
      success: true,
      executed: executedMigrations.map(m => m.name),
      pending: pendingMigrations.map(m => m.name),
      total_migrations: executedMigrations.length + pendingMigrations.length
    });

  } catch (error) {
    console.error('Migration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check migration status',
      error: error.message
    });
  }
});

// Add this temporary endpoint to manually add the missing column (quick fix)
app.get('/fix-trending-column', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database not initialized'
      });
    }

    const queryInterface = db.sequelize.getQueryInterface();
    
    // Check if column exists
    const tableDescription = await queryInterface.describeTable('products');
    
    if (tableDescription.is_trending) {
      return res.json({
        success: true,
        message: 'is_trending column already exists',
        column_exists: true
      });
    }

    // Add the column
    await queryInterface.addColumn('products', 'is_trending', {
      type: db.Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    res.json({
      success: true,
      message: 'is_trending column added successfully',
      column_exists: true
    });

  } catch (error) {
    console.error('Fix trending column error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add is_trending column',
      error: error.message
    });
  }
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
    initializationState.database = 'initializing';
    console.log('Initializing database...');
    
    if (!checkPgPackage()) {
      throw new Error('pg package not available');
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
    
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    // Import and use routes
    const adminRoutes = require('../routes/admin');
    const buyerRoutes = require('../routes/buyer');
    
    app.use('/admin', adminRoutes);
    app.use('/buyer', buyerRoutes);
    
    console.log('Routes initialized successfully');
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
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
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

// Initialize database first
if (initializeDatabase()) {
  // Then initialize routes
  initializeRoutes();
}

// Initialize Cloudinary (independent of database)
initializeCloudinary();

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
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

console.log('Application setup completed');

// CORS test endpoint - ADD THIS AFTER YOUR EXISTING ROUTES
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

module.exports = app;