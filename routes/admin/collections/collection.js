const express = require('express');
const router = express.Router();
const { 
    createCollection, 
    getAllCollections, 
    getCollectionById, 
    updateCollection, 
    deleteCollection 
} = require('../../../controllers/admin/collections/collection');

// Create a new collection
router.post('/', createCollection);

// Get all collections
router.get('/', getAllCollections);

// Get collection by ID
router.get('/:id', getCollectionById);

// Update collection
router.put('/:id', updateCollection);

// Delete collection
router.delete('/:id', deleteCollection);

module.exports = router;