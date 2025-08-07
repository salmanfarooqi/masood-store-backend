const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');

// Hardcoded database configuration (no environment variables)
const DB_CONFIG = {
  username: 'neondb_owner',
  password: 'npg_ZnRBm0zsAlC5',
  database: 'neondb',
  host: 'ep-noisy-block-ab07awdx-pooler.eu-west-2.aws.neon.tech',
  port: 5432
};

// Create Sequelize instance with hardcoded config
const sequelize = new Sequelize(DB_CONFIG.database, DB_CONFIG.username, DB_CONFIG.password, {
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 2,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
});

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Test deployment server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'configured with hardcoded values'
  });
});

// Database connection test
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'success',
      message: 'Database connection successful!',
      database: DB_CONFIG.database,
      host: DB_CONFIG.host,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Environment test
app.get('/test-env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    VERCEL: process.env.VERCEL || false,
    database: 'hardcoded configuration',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    app.listen(PORT, () => {
      console.log(`Test server is running on port ${PORT}`);
      console.log(`Database: ${DB_CONFIG.database} on ${DB_CONFIG.host}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

module.exports = app; 