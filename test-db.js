require('dotenv').config();

console.log('🔍 Database Connection Test');
console.log('==========================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST ? 'SET' : 'NOT SET');
console.log('DB_DATABASE:', process.env.DB_DATABASE ? 'SET' : 'NOT SET');
console.log('DB_USERNAME:', process.env.DB_USERNAME ? 'SET' : 'NOT SET');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
console.log('DB_PORT:', process.env.DB_PORT || '5432');

// Test database connection
const testConnection = async () => {
  try {
    const { Sequelize } = require('sequelize');
    
    if (!process.env.DB_HOST || !process.env.DB_DATABASE || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
      console.log('\n❌ Database environment variables not set');
      console.log('Please set: DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD');
      return;
    }
    
    console.log('\n🔌 Attempting database connection...');
    
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
    console.log('✅ Database connection successful!');
    
    await sequelize.close();
    console.log('✅ Connection closed gracefully');
    
  } catch (error) {
    console.log('❌ Database connection failed:');
    console.log('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 This usually means the database server is not accessible');
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 This usually means the hostname is incorrect');
    } else if (error.message.includes('authentication')) {
      console.log('💡 This usually means the username/password is incorrect');
    } else if (error.message.includes('database')) {
      console.log('💡 This usually means the database name is incorrect');
    }
  }
};

// Test with timeout
const runTest = async () => {
  try {
    await Promise.race([
      testConnection(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timeout after 30 seconds')), 30000)
      )
    ]);
  } catch (error) {
    console.log('⏰ Test timed out:', error.message);
  }
};

runTest(); 