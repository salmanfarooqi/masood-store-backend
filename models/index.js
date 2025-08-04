'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

// Enhanced database connection setup with error handling
const setupDatabase = () => {
  try {
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
      sequelize = new Sequelize(config.database, config.username, config.password, {
        ...config,
        // Enhanced connection pooling for serverless
        pool: {
          max: process.env.NODE_ENV === 'production' ? 2 : 5,
          min: 0,
          acquire: 60000,
          idle: 10000,
          handleDisconnects: true
        },
        retry: {
          max: 3,
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
        }
      });
    }

    // Test the connection with timeout
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
        // Don't throw error in production to allow serverless to start
        if (process.env.NODE_ENV === 'development') {
          throw err;
        }
      }
    };

    // Test connection immediately
    testConnection();

    return sequelize;
  } catch (error) {
    console.error('Database setup failed:', error);
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    // In production, return a mock sequelize to prevent crashes
    return {
      authenticate: () => Promise.reject(new Error('Database not configured')),
      sync: () => Promise.resolve(),
      close: () => Promise.resolve()
    };
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
