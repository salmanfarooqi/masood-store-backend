#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the backend directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Checking environment variables..."
if [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_DATABASE" ] || [ -z "$DB_HOST" ]; then
    echo "⚠️  Warning: Database environment variables not set"
    echo "   Make sure to set: DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST"
else
    echo "✅ Database environment variables are set"
fi

if [ -z "$CLOUDINARY_CLOUD_NAME" ] || [ -z "$CLOUDINARY_API_KEY" ] || [ -z "$CLOUDINARY_API_SECRET" ]; then
    echo "⚠️  Warning: Cloudinary environment variables not set"
    echo "   Make sure to set: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
else
    echo "✅ Cloudinary environment variables are set"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  Warning: JWT_SECRET not set"
    echo "   Make sure to set JWT_SECRET for authentication"
else
    echo "✅ JWT_SECRET is set"
fi

echo "🧪 Testing server startup..."
NODE_ENV=production node -e "
const app = require('./server.js');
console.log('✅ Server module loaded successfully');
process.exit(0);
" || {
    echo "❌ Error: Server module failed to load"
    exit 1
}

echo "🔧 Checking Vercel configuration..."
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found"
    exit 1
else
    echo "✅ vercel.json found"
fi

echo "📋 Deployment checklist:"
echo "   ✅ Dependencies installed"
echo "   ✅ Server module loads"
echo "   ✅ Vercel config present"
echo ""
echo "🚀 Ready to deploy to Vercel!"
echo "   Run: vercel --prod"
echo ""
echo "🔍 For troubleshooting:"
echo "   - Check Vercel logs: vercel logs"
echo "   - Test locally: npm run dev"
echo "   - Check health endpoint: curl https://your-app.vercel.app/health" 