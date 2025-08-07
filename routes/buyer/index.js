const express = require('express');
const router = express.Router();

// Import all buyer route modules
const { buyerauthRouter } = require('./auth/auth');
const { cartRouter } = require('./cart/cart');
const { guestCartRouter } = require('./cart/guestCart');
const BuyerCategoryRouter = require('./categories/category');
const buyerProductRouter = require('./products/product');
const buyerPaymentRouter = require('./payments/payment');
const buyerOrderRouter = require('./orders/order');
const guestOrderRouter = require('./orders/guestOrder');
const wishlistRouter = require('./wishlist/wishlist');
const buyerCollectionRouter = require('./collections/collection');
const buyerReviewRouter = require('./reviews/review');

// Import middleware
const { authenticateToken } = require('../../midleware');

// Mount all buyer routes
// Auth routes (no authentication required)
router.use('/', buyerauthRouter);

// Category routes (no authentication required)
router.use('/', BuyerCategoryRouter);

// Product routes (no authentication required) - This includes /getProducts
router.use('/', buyerProductRouter);

// Collection routes (no authentication required)
router.use('/collections', buyerCollectionRouter);

// Review routes (no authentication required)
router.use('/reviews', buyerReviewRouter);

// Guest routes (no authentication required) - must come first
router.use('/', guestCartRouter);
router.use('/', guestOrderRouter);

// Authenticated routes
router.use('/', authenticateToken, cartRouter);
router.use('/', authenticateToken, buyerPaymentRouter);
router.use('/', authenticateToken, buyerOrderRouter);
router.use('/wishlist', authenticateToken, wishlistRouter);

module.exports = router;