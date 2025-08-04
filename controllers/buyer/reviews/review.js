const db = require("../../../models");

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sortBy = 'newest' } = req.query;

        // Check if product exists
        const product = await db.product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Build order clause
        let orderClause = [['createdAt', 'DESC']];
        switch (sortBy) {
            case 'oldest':
                orderClause = [['createdAt', 'ASC']];
                break;
            case 'rating_high':
                orderClause = [['rating', 'DESC']];
                break;
            case 'rating_low':
                orderClause = [['rating', 'ASC']];
                break;
            default:
                orderClause = [['createdAt', 'DESC']];
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get reviews with pagination
        const { count, rows: reviews } = await db.Review.findAndCountAll({
            where: { 
                product_id: productId,
                is_approved: true 
            },
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name'],
                required: false
            }],
            order: orderClause,
            limit: parseInt(limit),
            offset: offset
        });

        // Calculate rating statistics
        const ratingStats = await db.Review.findAll({
            where: { 
                product_id: productId,
                is_approved: true 
            },
            attributes: [
                'rating',
                [db.sequelize.fn('COUNT', db.sequelize.col('rating')), 'count']
            ],
            group: ['rating'],
            raw: true
        });

        // Calculate average rating
        const totalReviews = await db.Review.count({
            where: { 
                product_id: productId,
                is_approved: true 
            }
        });

        const avgRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0;

        const totalPages = Math.ceil(count / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                reviews,
                stats: {
                    average_rating: Math.round(avgRating * 10) / 10,
                    total_reviews: totalReviews,
                    rating_breakdown: ratingStats
                },
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalReviews: count,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching product reviews: " + error.message
        });
    }
};

// Create a new review (by logged-in user or guest)
const createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { 
            rating, 
            title, 
            comment, 
            reviewer_name, 
            reviewer_email 
        } = req.body;

        if (!rating || !reviewer_name) {
            return res.status(400).json({
                success: false,
                message: "Rating and reviewer name are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check if product exists
        const product = await db.product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Get user ID if logged in
        const userId = req.user ? req.user.id : null;

        // Check if user has already reviewed this product (if logged in)
        if (userId) {
            const existingReview = await db.Review.findOne({
                where: { 
                    product_id: productId,
                    user_id: userId 
                }
            });

            if (existingReview) {
                return res.status(400).json({
                    success: false,
                    message: "You have already reviewed this product"
                });
            }
        }

        const review = await db.Review.create({
            product_id: productId,
            user_id: userId,
            rating,
            title: title || '',
            comment: comment || '',
            reviewer_name,
            reviewer_email: reviewer_email || '',
            is_verified: userId ? true : false, // Verified if user is logged in
            is_approved: true // Auto-approve for now, can be changed to false for moderation
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

// Get related products based on category or collection
const getRelatedProducts = async (req, res) => {
    try {
        const { productId } = req.params;
        const { limit = 8 } = req.query;

        // Get the current product
        const currentProduct = await db.product.findByPk(productId);
        if (!currentProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find related products based on collection first, then category
        let relatedProducts = [];

        if (currentProduct.collection_id) {
            // Find products in the same collection
            relatedProducts = await db.product.findAll({
                where: {
                    collection_id: currentProduct.collection_id,
                    id: { [db.Sequelize.Op.ne]: productId } // Exclude current product
                },
                include: [{
                    model: db.Review,
                    as: 'reviews',
                    attributes: ['rating'],
                    where: { is_approved: true },
                    required: false
                }],
                limit: parseInt(limit),
                order: [['createdAt', 'DESC']]
            });
        }

        // If not enough products from collection, get from same category
        if (relatedProducts.length < parseInt(limit)) {
            const remainingLimit = parseInt(limit) - relatedProducts.length;
            const categoryProducts = await db.product.findAll({
                where: {
                    [db.Sequelize.Op.or]: [
                        { parent_category: currentProduct.parent_category },
                        { child_category: currentProduct.child_category }
                    ],
                    id: { 
                        [db.Sequelize.Op.notIn]: [
                            productId, 
                            ...relatedProducts.map(p => p.id)
                        ] 
                    }
                },
                include: [{
                    model: db.Review,
                    as: 'reviews',
                    attributes: ['rating'],
                    where: { is_approved: true },
                    required: false
                }],
                limit: remainingLimit,
                order: [['createdAt', 'DESC']]
            });

            relatedProducts = [...relatedProducts, ...categoryProducts];
        }

        // Calculate average rating for each product
        const productsWithRating = relatedProducts.map(product => {
            const reviews = product.reviews || [];
            const avgRating = reviews.length > 0 
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                : 0;
            
            return {
                ...product.toJSON(),
                average_rating: Math.round(avgRating * 10) / 10,
                review_count: reviews.length,
                reviews: undefined // Remove reviews from response
            };
        });

        res.status(200).json({
            success: true,
            data: productsWithRating
        });
    } catch (error) {
        console.error("Error fetching related products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching related products: " + error.message
        });
    }
};

module.exports = {
    getProductReviews,
    createReview,
    getRelatedProducts
}; 