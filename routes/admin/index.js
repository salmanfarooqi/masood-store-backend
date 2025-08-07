const express = require('express');
const router = express.Router();

// Import all admin route modules
const authRouter = require('./auth/auth');
const categoryRouter = require('./categories/category');
const productRouter = require('./products/product');
const orderRouter = require('./orders/order');
const analyticsRouter = require('./analytics/analytics');
const adminCollectionRouter = require('./collections/collection');
const adminReviewRouter = require('./reviews/review');

// Import middleware
const { authenticateToken } = require('../../midleware');

// Basic admin route for testing
router.get('/test', (req, res) => {
  res.json({
    message: 'Admin routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Mount all admin routes
// Auth routes (no authentication required for login)
router.use('/', authRouter);

// Protected admin routes (require authentication)
router.use('/', authenticateToken, categoryRouter);
router.use('/', authenticateToken, productRouter);
router.use('/', authenticateToken, orderRouter);
router.use('/', authenticateToken, analyticsRouter);
router.use('/collections', authenticateToken, adminCollectionRouter);
router.use('/reviews', authenticateToken, adminReviewRouter);

module.exports = router;