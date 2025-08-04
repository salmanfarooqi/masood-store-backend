const express = require('express');
const router = express.Router();
const { 
    createReview, 
    getAllReviews, 
    getReviewById, 
    updateReview, 
    deleteReview, 
    toggleReviewApproval 
} = require('../../../controllers/admin/reviews/review');

// Create a new review
router.post('/', createReview);

// Get all reviews (with optional filters)
router.get('/', getAllReviews);

// Get review by ID
router.get('/:id', getReviewById);

// Update review
router.put('/:id', updateReview);

// Toggle review approval
router.patch('/:id/approval', toggleReviewApproval);

// Delete review
router.delete('/:id', deleteReview);

module.exports = router; 