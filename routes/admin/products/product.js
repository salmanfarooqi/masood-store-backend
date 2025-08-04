const express = require('express');
const router = express.Router();
const { 
    addProduct, 
    getProductByAdmin, 
    updateProduct, 
    deleteProduct, 
    getProductById 
} = require('../../../controllers/admin/products/product');

// Get all products
router.get('/getProducts', getProductByAdmin);

// Get product by ID
router.get('/getProduct/:id', getProductById);

// Add new product
router.post('/addProduct', addProduct);

// Update product
router.put('/updateProduct/:id', updateProduct);

// Delete product
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;