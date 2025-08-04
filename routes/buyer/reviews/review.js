const express = require('express');
const router = express.Router();
const { 
    getProductReviews, 
    createReview, 
    getRelatedProducts 
} = require('../../../controllers/buyer/reviews/review');

// Get reviews for a product
router.get('/product/:productId', getProductReviews);

// Create a new review for a product
router.post('/product/:productId', createReview);

// Get related products
router.get('/product/:productId/related', getRelatedProducts);

module.exports = router; 
 