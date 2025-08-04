const express = require('express');
const router = express.Router();
const { 
    addCategory, 
    addChildCategory, 
    getAllParentCategory, 
    getAllChildCategory,
    updateParentCategory,
    updateChildCategory,
    deleteParentCategory,
    deleteChildCategory,
    getCategoryById
} = require('../../../controllers/admin/categories/category');

// Get all parent categories
router.get('/getAllParentCategory', getAllParentCategory);

// Get all child categories
router.get('/getAllChildCategory', getAllChildCategory);

// Get category by ID
router.get('/getCategory/:id', getCategoryById);

// Add parent category
router.post('/addCategory', addCategory);

// Add child category
router.post('/addChildCategory', addChildCategory);

// Update parent category
router.put('/updateParentCategory/:id', updateParentCategory);

// Update child category
router.put('/updateChildCategory/:id', updateChildCategory);

// Delete parent category
router.delete('/deleteParentCategory/:id', deleteParentCategory);

// Delete child category
router.delete('/deleteChildCategory/:id', deleteChildCategory);

module.exports = router;