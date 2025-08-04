const db = require("../../../models")

let addProduct = async (req, res) => {
    try {
        const {
            name, 
            description, 
            parentCategory, 
            childCategory, 
            price, 
            discount, 
            stock, 
            weight, 
            image,
            colors,
            is_on_sale,
            sale_price,
            sale_percentage,
            size,
            video,
            collection_id,
            is_trending
        } = req.body

        // Ensure image is always an array
        let imageArray = image;
        if (!Array.isArray(image)) {
            // If image is a string, convert to array
            if (typeof image === 'string') {
                imageArray = [image];
            } else {
                // If image is null/undefined, use empty array
                imageArray = [];
            }
        }

        // Ensure colors is always an array
        let colorsArray = colors;
        if (!Array.isArray(colors)) {
            if (typeof colors === 'string') {
                colorsArray = [colors];
            } else {
                colorsArray = [];
            }
        }

        // Convert numeric fields to proper types
        const numericPrice = price ? parseFloat(price) : 0;
        const numericStock = stock ? parseFloat(stock) : 0;
        const numericDiscount = discount ? parseFloat(discount) : 0;
        const numericWeight = weight ? parseFloat(weight) : 0;
        const numericSalePrice = sale_price ? parseFloat(sale_price) : null;
        const numericSalePercentage = sale_percentage ? parseFloat(sale_percentage) : null;

        // Handle empty strings for text fields
        const cleanParentCategory = parentCategory || '';
        const cleanChildCategory = childCategory || '';

        await db.product.create({
            name,
            description,
            stock: numericStock,
            price: numericPrice,
            discount: numericDiscount,
            weight: numericWeight,
            parent_category: cleanParentCategory, 
            child_category: cleanChildCategory,
            image: imageArray,
            colors: colorsArray,
            is_on_sale: is_on_sale || false,
            sale_price: numericSalePrice,
            sale_percentage: numericSalePercentage,
            size: size || '',
            video: video || '',
            collection_id: collection_id || null,
            is_trending: is_trending || false
        })

        console.log("req", req.body)
        res.status(201).json({
            success: true,
            message: "Product added successfully"
        })
        
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            success: false,
            message: "Error adding product: " + error.message
        });
    }
}

let getProductByAdmin = async (req, res) => {
    try {
        let products = await db.product.findAll({
            include: [{
                model: db.Collection,
                as: 'collection',
                attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']]
        })
        console.log("products", products)
        
        if (products && products.length > 0) {
            res.status(200).json(products)
        } else {
            res.status(200).json([])
        }
        
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching products: " + error.message 
        });
    }
}

let updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, 
            description, 
            parentCategory, 
            childCategory, 
            price, 
            discount, 
            stock, 
            weight, 
            image,
            colors,
            is_on_sale,
            sale_price,
            sale_percentage,
            size,
            video,
            collection_id,
            is_trending
        } = req.body;

        // Ensure image is always an array
        let imageArray = image;
        if (!Array.isArray(image)) {
            if (typeof image === 'string') {
                imageArray = [image];
            } else {
                imageArray = [];
            }
        }

        // Ensure colors is always an array
        let colorsArray = colors;
        if (!Array.isArray(colors)) {
            if (typeof colors === 'string') {
                colorsArray = [colors];
            } else {
                colorsArray = [];
            }
        }

        // Convert numeric fields
        const numericPrice = price ? parseFloat(price) : 0;
        const numericStock = stock ? parseFloat(stock) : 0;
        const numericDiscount = discount ? parseFloat(discount) : 0;
        const numericWeight = weight ? parseFloat(weight) : 0;
        const numericSalePrice = sale_price ? parseFloat(sale_price) : null;
        const numericSalePercentage = sale_percentage ? parseFloat(sale_percentage) : null;

        const product = await db.product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await product.update({
            name,
            description,
            stock: numericStock,
            price: numericPrice,
            discount: numericDiscount,
            weight: numericWeight,
            parent_category: parentCategory || '',
            child_category: childCategory || '',
            image: imageArray,
            colors: colorsArray,
            is_on_sale: is_on_sale || false,
            sale_price: numericSalePrice,
            sale_percentage: numericSalePercentage,
            size: size || '',
            video: video || '',
            collection_id: collection_id || null,
            is_trending: is_trending || false
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Error updating product: " + error.message
        });
    }
}

let deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await db.product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting product: " + error.message
        });
    }
}

let getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await db.product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching product: " + error.message
        });
    }
}

module.exports = {
    addProduct,
    getProductByAdmin,
    updateProduct,
    deleteProduct,
    getProductById
}