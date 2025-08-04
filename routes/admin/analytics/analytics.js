const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getSalesAnalytics, 
    getTopProducts, 
    getCategoryAnalytics, 
    getRecentActivity 
} = require('../../../controllers/admin/analytics/analytics');

// Get dashboard statistics
router.get('/getDashboardStats', getDashboardStats);

// Get sales analytics
router.get('/getSalesAnalytics', getSalesAnalytics);

// Get top products
router.get('/getTopProducts', getTopProducts);

// Get category analytics
router.get('/getCategoryAnalytics', getCategoryAnalytics);

// Get recent activity
router.get('/getRecentActivity', getRecentActivity);

module.exports = router; 