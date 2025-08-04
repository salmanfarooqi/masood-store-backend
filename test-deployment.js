const express = require('express');
const app = express();
require('dotenv').config();

// Basic middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test database connection
const testDatabase = async () => {
  try {
    const { Sequelize } = require('sequelize');
    
    if (!process.env.DB_HOST || !process.env.DB_DATABASE || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
      return { status: 'not_configured', message: 'Database environment variables not set' };
    }
    
    const sequelize = new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        pool: {
          max: 1,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );
    
    await sequelize.authenticate();
    await sequelize.close();
    
    return { status: 'connected', message: 'Database connection successful' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Test deployment server is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
});

app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

app.get('/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: !!process.env.VERCEL,
    DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT SET',
    DB_DATABASE: process.env.DB_DATABASE ? 'SET' : 'NOT SET',
    DB_USERNAME: process.env.DB_USERNAME ? 'SET' : 'NOT SET',
    DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
    DB_PORT: process.env.DB_PORT || '5432',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await testDatabase();
    res.json({
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Only start server in development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Test deployment server running on port ${PORT}`);
  });
}

module.exports = app; 