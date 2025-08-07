'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
console.log('Loading database configuration for environment:', env);
const config = require(__dirname + '/../config/config.js')[env];
console.log('Database config loaded:', {
  database: config.database,
  host: config.host,
  port: config.port,
  username: config.username,
  dialect: config.dialect
});
const db = {};

let sequelize;

// Enhanced database connection setup with error handling for serverless
const setupDatabase = () => {
  try {
    console.log('Setting up database with config:', {
      database: config.database,
      host: config.host,
      port: config.port,
      username: config.username
    });
    
    // Always use direct configuration, not environment variables
    sequelize = new Sequelize(config.database, config.username, config.password, {
      ...config,
      // Enhanced connection pooling for serverless
      pool: {
        max: 1, // Very low for serverless
        min: 0,
        acquire: 30000, // Reduced timeout
        idle: 5000,
        handleDisconnects: true
      },
      retry: {
        max: 2, // Reduced retries
        backoffBase: 1000,
        backoffExponent: 1.5
      },
      // Connection event handlers
      hooks: {
        beforeConnect: async (config) => {
          console.log('Attempting database connection...');
        },
        afterConnect: async (connection) => {
          console.log('Database connection established successfully.');
        }
      },
      // Disable logging in production
      logging: false,
      // Lazy connection for serverless
      dialectOptions: {
        ...config.dialectOptions,
        // Shorter timeouts for serverless
        connectTimeout: 30000,
        acquireTimeout: 30000,
        timeout: 30000
      }
    });

    // Don't test connection immediately in production (serverless)
    if (process.env.NODE_ENV === 'development') {
      const testConnection = async () => {
        try {
          await Promise.race([
            sequelize.authenticate(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Database connection timeout')), 10000)
            )
          ]);
          console.log('Database connection has been established successfully.');
        } catch (err) {
          console.error('Unable to connect to the database:', err);
          throw err;
        }
      };
      testConnection();
    }

    return sequelize;
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
};

sequelize = setupDatabase();

// Load models with error handling
const loadModels = () => {
  try {
    fs
      .readdirSync(__dirname)
      .filter(file => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js' &&
          file.indexOf('.test.js') === -1
        );
      })
      .forEach(file => {
        try {
          const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
          db[model.name] = model;
        } catch (error) {
          console.error(`Error loading model ${file}:`, error);
        }
      });

    // Set up associations with error handling
    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        try {
          db[modelName].associate(db);
        } catch (error) {
          console.error(`Error setting up associations for ${modelName}:`, error);
        }
      }
    });

    console.log('Models loaded successfully');
  } catch (error) {
    console.error('Error loading models:', error);
  }
};

loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Enhanced database health check
db.healthCheck = async () => {
  try {
    await sequelize.authenticate();
    return { status: 'healthy', message: 'Database connection successful' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// Graceful shutdown handler
db.closeConnection = async () => {
  try {
    if (sequelize && typeof sequelize.close === 'function') {
      await sequelize.close();
      console.log('Database connection closed gracefully');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

module.exports = db;
