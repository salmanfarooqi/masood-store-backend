const db = require("../../../models")

const addCategory = async (req, res) => {
    try {
        const { name, color, icon } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const category = await db.parentCategory.create({
            name,
            color: color || '#3B82F6',
            icon: icon || 'FiPackage'
        });

        res.status(201).json({
            success: true,
            message: "Category added successfully",
            category
        });
        
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({
            success: false,
            message: "Error adding category: " + error.message
        });
    }
}

const addChildCategory = async (req, res) => {
    try {
        const { name, color, icon, parentCategoryId } = req.body;

        if (!name || !parentCategoryId) {
            return res.status(400).json({
                success: false,
                message: "Category name and parent category are required"
            });
        }

        const childCategory = await db.childCategory.create({
            name,
            color: color || '#3B82F6',
            icon: icon || 'FiPackage',
            parent_id: parentCategoryId
        });

        res.status(201).json({
            success: true,
            message: "Child category added successfully",
            category: childCategory
        });
        
    } catch (error) {
        console.error("Error adding child category:", error);
        res.status(500).json({
            success: false,
            message: "Error adding child category: " + error.message
        });
    }
}

const getAllParentCategory = async (req, res) => {
    try {
        const categories = await db.parentCategory.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Get product counts for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await db.product.count({
                    where: { parent_category: category.name }
                });
                
                const childCategories = await db.childCategory.findAll({
                    where: { parent_id: category.id },
                    attributes: ['id', 'name', 'color', 'icon']
                });

                return {
                    ...category.toJSON(),
                    productCount,
                    childCategories
                };
            })
        );

        res.status(200).json({
            success: true,
            categories: categoriesWithCount
        });
        
    } catch (error) {
        console.error("Error fetching parent categories:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching categories: " + error.message
        });
    }
}

const getAllChildCategory = async (req, res) => {
    try {
        const categories = await db.childCategory.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Get product counts and parent info for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await db.product.count({
                    where: { child_category: category.name }
                });
                
                const parentCategory = await db.parentCategory.findByPk(category.parent_id);

                return {
                    ...category.toJSON(),
                    productCount,
                    parentCategory: parentCategory ? {
                        id: parentCategory.id,
                        name: parentCategory.name
                    } : null
                };
            })
        );

        res.status(200).json({
            success: true,
            categories: categoriesWithCount
        });
        
    } catch (error) {
        console.error("Error fetching child categories:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching child categories: " + error.message
        });
    }
}

const updateParentCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color, icon } = req.body;

        const category = await db.parentCategory.findByPk(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await category.update({
            name: name || category.name,
            color: color || category.color,
            icon: icon || category.icon
        });

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error("Error updating parent category:", error);
        res.status(500).json({
            success: false,
            message: "Error updating category: " + error.message
        });
    }
}

const updateChildCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color, icon, parentCategoryId } = req.body;

        const category = await db.childCategory.findByPk(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await category.update({
            name: name || category.name,
            color: color || category.color,
            icon: icon || category.icon,
            parent_id: parentCategoryId || category.parent_id
        });

        res.status(200).json({
            success: true,
            message: "Child category updated successfully",
            category
        });

    } catch (error) {
        console.error("Error updating child category:", error);
        res.status(500).json({
            success: false,
            message: "Error updating child category: " + error.message
        });
    }
}

const deleteParentCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const category = await db.parentCategory.findByPk(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Check if category has products
        const productCount = await db.product.count({
            where: { parent_category: category.name }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${productCount} associated products.`
            });
        }

        await category.destroy();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting parent category:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting category: " + error.message
        });
    }
}

const deleteChildCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const category = await db.childCategory.findByPk(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Check if category has products
        const productCount = await db.product.count({
            where: { child_category: category.name }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${productCount} associated products.`
            });
        }

        await category.destroy();

        res.status(200).json({
            success: true,
            message: "Child category deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting child category:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting child category: " + error.message
        });
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const category = await db.parentCategory.findByPk(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Get child categories
        const childCategories = await db.childCategory.findAll({
            where: { parent_id: category.id }
        });

        res.status(200).json({
            success: true,
            category: {
                ...category.toJSON(),
                childCategories
            }
        });

    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching category: " + error.message
        });
    }
}

module.exports = {
    addCategory,
    addChildCategory,
    getAllParentCategory,
    getAllChildCategory,
    updateParentCategory,
    updateChildCategory,
    deleteParentCategory,
    deleteChildCategory,
    getCategoryById
}