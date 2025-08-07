require('dotenv').config();

// Database configuration with hardcoded values (no environment variables)
const DB_CONFIG = {
  username: 'neondb_owner',
  password: 'npg_ZnRBm0zsAlC5',
  database: 'neondb',
  host: 'ep-noisy-block-ab07awdx-pooler.eu-west-2.aws.neon.tech',
  port: 5432
};

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Database Configuration:');
  console.log('DB_USERNAME:', DB_CONFIG.username);
  console.log('DB_PASSWORD:', DB_CONFIG.password ? '***SET***' : '***NOT SET***');
  console.log('DB_DATABASE:', DB_CONFIG.database);
  console.log('DB_HOST:', DB_CONFIG.host);
  console.log('DB_PORT:', DB_CONFIG.port);
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
    username: DB_CONFIG.username,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    ...commonConfig,
    pool: {
      ...commonConfig.pool,
      max: 5 // More connections for development
    }
  },
  test: {
    username: DB_CONFIG.username,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    ...commonConfig,
    pool: {
      ...commonConfig.pool,
      max: 2 // Fewer connections for testing
    }
  },
  production: {
    username: DB_CONFIG.username,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    ...commonConfig,
    pool: {
      ...commonConfig.pool,
      max: 2 // Optimized for serverless - fewer connections
    }
  },
};
