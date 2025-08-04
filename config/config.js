require('dotenv').config();

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Environment Variables:');
  console.log('DB_USERNAME:', process.env.DB_USERNAME);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : '***NOT SET***');
  console.log('DB_DATABASE:', process.env.DB_DATABASE);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
}

// Common configuration for all environments
const commonConfig = {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    // Connection timeout settings for serverless
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
  },
  // Enhanced connection pooling for serverless
  pool: {
    max: process.env.NODE_ENV === 'production' ? 2 : 5, // Lower max connections for serverless
    min: 0,
    acquire: 60000, // Increased acquire timeout
    idle: 10000,
    // Handle connection errors gracefully
    handleDisconnects: true
  },
  // Retry configuration for better reliability
  retry: {
    max: 3,
    backoffBase: 1000,
    backoffExponent: 1.5
  },
  // Query timeout
  query: {
    timeout: 30000
  }
};

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ...commonConfig,
    pool: {
      ...commonConfig.pool,
      max: 5 // More connections for development
    }
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ...commonConfig,
    pool: {
      ...commonConfig.pool,
      max: 2 // Fewer connections for testing
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ...commonConfig,
    pool: {
      ...commonConfig.pool,
      max: 2 // Optimized for serverless - fewer connections
    }
  },
};
