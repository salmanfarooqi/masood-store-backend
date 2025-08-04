const db = require("../../../models");

// Get all active collections
const getActiveCollections = async (req, res) => {
    try {
        const collections = await db.Collection.findAll({
            where: { is_active: true },
            attributes: ['id', 'name', 'description', 'image'],
            include: [{
                model: db.product,
                as: 'products',
                attributes: ['id'],
                required: false
            }],
            order: [['createdAt', 'ASC']]
        });

        // Add product count to each collection
        const collectionsWithCount = collections.map(collection => ({
            ...collection.toJSON(),
            product_count: collection.products ? collection.products.length : 0
        }));

        res.status(200).json({
            success: true,
            data: collectionsWithCount
        });
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching collections: " + error.message
        });
    }
};

// Get collection by ID with its products
const getCollectionWithProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, sortBy = 'newest', priceMin, priceMax } = req.query;

        const collection = await db.Collection.findOne({
            where: { 
                id: id,
                is_active: true 
            },
            attributes: ['id', 'name', 'description', 'image']
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found"
            });
        }

        // Build where clause for products
        const productWhere = { collection_id: id };
        
        // Add price filter if provided
        if (priceMin || priceMax) {
            productWhere.price = {};
            if (priceMin) productWhere.price[db.Sequelize.Op.gte] = parseFloat(priceMin);
            if (priceMax) productWhere.price[db.Sequelize.Op.lte] = parseFloat(priceMax);
        }

        // Build order clause
        let orderClause = [['createdAt', 'DESC']];
        switch (sortBy) {
            case 'price_low':
                orderClause = [['price', 'ASC']];
                break;
            case 'price_high':
                orderClause = [['price', 'DESC']];
                break;
            case 'name':
                orderClause = [['name', 'ASC']];
                break;
            case 'oldest':
                orderClause = [['createdAt', 'ASC']];
                break;
            default:
                orderClause = [['createdAt', 'DESC']];
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get products with pagination
        const { count, rows: products } = await db.product.findAndCountAll({
            where: productWhere,
            include: [{
                model: db.Review,
                as: 'reviews',
                attributes: ['rating'],
                where: { is_approved: true },
                required: false
            }],
            order: orderClause,
            limit: parseInt(limit),
            offset: offset
        });

        // Calculate average rating for each product
        const productsWithRating = products.map(product => {
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

        const totalPages = Math.ceil(count / parseInt(limit));

        res.status(200).json({
            success: true,
            data: {
                collection,
                products: productsWithRating,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalProducts: count,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        console.error("Error fetching collection products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching collection products: " + error.message
        });
    }
};

module.exports = {
    getActiveCollections,
    getCollectionWithProducts
}; 