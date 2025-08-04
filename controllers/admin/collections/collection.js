const db = require("../../../models");

// Create a new collection
const createCollection = async (req, res) => {
    try {
        const { name, description, image, is_active = true } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Collection name is required"
            });
        }

        const collection = await db.Collection.create({
            name,
            description: description || '',
            image: image || '',
            is_active
        });

        res.status(201).json({
            success: true,
            message: "Collection created successfully",
            data: collection
        });
    } catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).json({
            success: false,
            message: "Error creating collection: " + error.message
        });
    }
};

// Get all collections
const getAllCollections = async (req, res) => {
    try {
        const collections = await db.Collection.findAll({
            include: [{
                model: db.product,
                as: 'products',
                attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: collections
        });
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching collections: " + error.message
        });
    }
};

// Get collection by ID
const getCollectionById = async (req, res) => {
    try {
        const { id } = req.params;

        const collection = await db.Collection.findByPk(id, {
            include: [{
                model: db.product,
                as: 'products'
            }]
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found"
            });
        }

        res.status(200).json({
            success: true,
            data: collection
        });
    } catch (error) {
        console.error("Error fetching collection:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching collection: " + error.message
        });
    }
};

// Update collection
const updateCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, is_active } = req.body;

        const collection = await db.Collection.findByPk(id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found"
            });
        }

        await collection.update({
            name: name || collection.name,
            description: description !== undefined ? description : collection.description,
            image: image !== undefined ? image : collection.image,
            is_active: is_active !== undefined ? is_active : collection.is_active
        });

        res.status(200).json({
            success: true,
            message: "Collection updated successfully",
            data: collection
        });
    } catch (error) {
        console.error("Error updating collection:", error);
        res.status(500).json({
            success: false,
            message: "Error updating collection: " + error.message
        });
    }
};

// Delete collection
const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;

        const collection = await db.Collection.findByPk(id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found"
            });
        }

        // Check if collection has products
        const productCount = await db.product.count({
            where: { collection_id: id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete collection. It has products associated with it."
            });
        }

        await collection.destroy();

        res.status(200).json({
            success: true,
            message: "Collection deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting collection: " + error.message
        });
    }
};

module.exports = {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection
}; 