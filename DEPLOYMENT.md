# Vercel Deployment Guide

## Prerequisites

1. **Environment Variables**: Ensure all required environment variables are set in Vercel:
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `DB_DATABASE`
   - `DB_HOST`
   - `DB_PORT`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

2. **Database**: Ensure your PostgreSQL database is accessible from Vercel's servers

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from backend directory**:
   ```bash
   cd backend
   vercel --prod
   ```

## Environment Variables Setup

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
DB_HOST=your_db_host
DB_PORT=5432
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

## Troubleshooting

### Common Issues:

1. **FUNCTION_INVOCATION_FAILED**
   - Check environment variables are set correctly
   - Verify database connection
   - Check function timeout settings

2. **Database Connection Issues**
   - Ensure database allows connections from Vercel's IP ranges
   - Verify SSL settings in database configuration
   - Check database credentials

3. **Environment Variables Not Loading**
   - Redeploy after setting environment variables
   - Check variable names match exactly
   - Ensure no extra spaces in values

### Testing Your Deployment:

1. **Health Check**: Visit `/health` endpoint
2. **Basic Test**: Visit `/test` endpoint
3. **API Test**: Visit `/api/test` endpoint

### Debugging:

1. **Check Vercel Logs**:
   ```bash
   vercel logs
   ```

2. **Local Testing**:
   ```bash
   npm run dev
   ```

3. **Database Connection Test**:
   ```bash
   node -e "require('./models').sequelize.authenticate().then(() => console.log('DB OK')).catch(console.error)"
   ```

## Performance Optimization

1. **Connection Pooling**: Already configured in models/index.js
2. **Function Timeout**: Set to 30 seconds in vercel.json
3. **Cold Start**: Consider using Vercel Pro for better performance

## Security Checklist

- [ ] Environment variables are set
- [ ] Database credentials are secure
- [ ] JWT secret is strong
- [ ] CORS is properly configured
- [ ] SSL is enabled for database
- [ ] API keys are not exposed in code

## Monitoring

1. **Vercel Analytics**: Monitor function performance
2. **Database Monitoring**: Check connection pool usage
3. **Error Tracking**: Monitor function logs for errors 