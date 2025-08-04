# Vercel Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. FUNCTION_INVOCATION_FAILED (500 Error)

**Symptoms:**
- 500 Internal Server Error
- FUNCTION_INVOCATION_FAILED
- Function crashes on startup

**Common Causes:**
- Missing environment variables
- Database connection issues
- Module import errors
- Memory/timeout issues

**Solutions:**

#### Check Environment Variables
```bash
# Make sure these are set in Vercel dashboard:
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
DB_HOST=your_db_host
DB_PORT=5432
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

#### Test Database Connection
```bash
# Test your database connection locally
curl -X GET https://your-app.vercel.app/health
curl -X GET https://your-app.vercel.app/db-status
```

#### Check Vercel Logs
```bash
vercel logs
```

### 2. Database Connection Issues

**Symptoms:**
- Database connection timeout
- Sequelize connection errors
- Health check fails

**Solutions:**

#### Verify Database Credentials
- Check if your database is accessible from Vercel's servers
- Ensure SSL is properly configured
- Verify connection string format

#### Test Database Locally
```bash
# Test with your production database
NODE_ENV=production DB_HOST=your_host DB_DATABASE=your_db DB_USERNAME=your_user DB_PASSWORD=your_pass node -e "
const db = require('./models');
db.sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err));
"
```

### 3. Module Import Errors

**Symptoms:**
- Cannot find module errors
- Import/require failures

**Solutions:**

#### Check Dependencies
```bash
# Make sure all dependencies are in package.json
npm install
npm list --depth=0
```

#### Verify File Paths
- Ensure all import paths are correct
- Check for case sensitivity issues
- Verify file extensions

### 4. Memory and Timeout Issues

**Symptoms:**
- Function timeout errors
- Memory limit exceeded
- Cold start issues

**Solutions:**

#### Optimize for Serverless
- Reduce database connection pool size (max: 2 for production)
- Implement proper connection cleanup
- Use async/await properly
- Avoid blocking operations

#### Check Function Configuration
```json
// vercel.json
{
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

## Debugging Steps

### 1. Local Testing
```bash
# Test locally with production environment
NODE_ENV=production npm run dev

# Test specific endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/test
```

### 2. Vercel CLI Debugging
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy with debug info
vercel --debug

# Check function logs
vercel logs
```

### 3. Environment Variable Testing
```bash
# Test environment variables locally
NODE_ENV=production node -e "
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('NODE_ENV:', process.env.NODE_ENV);
"
```

## Health Check Endpoints

Use these endpoints to diagnose issues:

- `/` - Basic server response
- `/test` - Simple test endpoint
- `/api/test` - API test with environment info
- `/health` - Database connection test
- `/db-status` - Database status only

## Common Fixes

### 1. Update vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. Database Configuration
```javascript
// config/config.js
production: {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 2, // Reduced for serverless
    min: 0,
    acquire: 60000,
    idle: 10000
  }
}
```

### 3. Error Handling
```javascript
// Add proper error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});
```

## Getting Help

1. Check Vercel logs: `vercel logs`
2. Test endpoints locally
3. Verify environment variables
4. Check database connectivity
5. Review function timeout settings

## Quick Fix Checklist

- [ ] All environment variables set in Vercel dashboard
- [ ] Database accessible from Vercel servers
- [ ] All dependencies in package.json
- [ ] Proper error handling in code
- [ ] Database connection pooling optimized for serverless
- [ ] Function timeout settings appropriate
- [ ] SSL configuration correct for database
- [ ] No blocking operations in request handlers 