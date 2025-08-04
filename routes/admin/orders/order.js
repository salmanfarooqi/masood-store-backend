const express = require('express');
const router = express.Router();
const { 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus, 
    getOrderStats, 
    deleteOrder, 
    getRecentOrders 
} = require('../../../controllers/admin/orders/order');

// Get all orders
router.get('/getOrders', getAllOrders);

// Get order by ID
router.get('/getOrder/:id', getOrderById);

// Update order status
router.put('/updateOrderStatus/:id', updateOrderStatus);

// Get order statistics
router.get('/getOrderStats', getOrderStats);

// Delete order
router.delete('/deleteOrder/:id', deleteOrder);

// Get recent orders
router.get('/getRecentOrders', getRecentOrders);

module.exports = router; 