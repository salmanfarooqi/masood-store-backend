const db = require("../../../models");

// Create a review (admin can add reviews during product creation)
const createReview = async (req, res) => {
    try {
        const { 
            product_id, 
            rating, 
            title, 
            comment, 
            reviewer_name, 
            reviewer_email, 
            is_verified = false,
            is_approved = true 
        } = req.body;

        if (!product_id || !rating || !reviewer_name) {
            return res.status(400).json({
                success: false,
                message: "Product ID, rating, and reviewer name are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check if product exists
        const product = await db.product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const review = await db.Review.create({
            product_id,
            rating,
            title: title || '',
            comment: comment || '',
            reviewer_name,
            reviewer_email: reviewer_email || '',
            is_verified,
            is_approved
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({
            success: false,
            message: "Error creating review: " + error.message
        });
    }
};

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const { product_id, is_approved } = req.query;
        
        const where = {};
        if (product_id) where.product_id = product_id;
        if (is_approved !== undefined) where.is_approved = is_approved === 'true';

        const reviews = await db.Review.findAll({
            where,
            include: [{
                model: db.product,
                as: 'product',
                attributes: ['id', 'name', 'image']
            }, {
                model: db.User,
                as: 'user',
                attributes: ['id', 'name', 'email'],
                required: false
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching reviews: " + error.message
        });
    }
};

// Get review by ID
const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await db.Review.findByPk(id, {
            include: [{
                model: db.product,
                as: 'product',
                attributes: ['id', 'name', 'image']
            }, {
                model: db.User,
                as: 'user',
                attributes: ['id', 'name', 'email'],
                required: false
            }]
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching review: " + error.message
        });
    }
};

// Update review
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            rating, 
            title, 
            comment, 
            reviewer_name, 
            reviewer_email, 
            is_verified, 
            is_approved 
        } = req.body;

        const review = await db.Review.findByPk(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        await review.update({
            rating: rating || review.rating,
            title: title !== undefined ? title : review.title,
            comment: comment !== undefined ? comment : review.comment,
            reviewer_name: reviewer_name || review.reviewer_name,
            reviewer_email: reviewer_email !== undefined ? reviewer_email : review.reviewer_email,
            is_verified: is_verified !== undefined ? is_verified : review.is_verified,
            is_approved: is_approved !== undefined ? is_approved : review.is_approved
        });

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({
            success: false,
            message: "Error updating review: " + error.message
        });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await db.Review.findByPk(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        await review.destroy();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting review: " + error.message
        });
    }
};

// Approve/Reject review
const toggleReviewApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_approved } = req.body;

        const review = await db.Review.findByPk(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        await review.update({ is_approved });

        res.status(200).json({
            success: true,
            message: `Review ${is_approved ? 'approved' : 'rejected'} successfully`,
            data: review
        });
    } catch (error) {
        console.error("Error updating review approval:", error);
        res.status(500).json({
            success: false,
            message: "Error updating review approval: " + error.message
        });
    }
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    toggleReviewApproval
}; 