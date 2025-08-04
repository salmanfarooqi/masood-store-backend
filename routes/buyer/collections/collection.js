const express = require('express');
const router = express.Router();
const { 
    getActiveCollections, 
    getCollectionWithProducts 
} = require('../../../controllers/buyer/collections/collection');

// Get all active collections
router.get('/', getActiveCollections);

// Get collection with its products
router.get('/:id', getCollectionWithProducts);

module.exports = router; 