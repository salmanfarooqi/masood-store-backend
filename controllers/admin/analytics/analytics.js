const db = require("../../../models");
const { Op } = require("sequelize");

const getDashboardStats = async (req, res) => {
    try {
        // Get current date and last month date
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        // Total counts
        const totalProducts = await db.product.count();
        const totalOrders = await db.Order.count();
        const totalUsers = await db.User.count();
        const totalCategories = await db.parentCategory.count();

        // Revenue calculations
        const completedOrders = await db.Order.findAll({
            where: { status: 'completed' },
            attributes: ['total', 'createdAt']
        });

        const totalRevenue = completedOrders.reduce((sum, order) => {
            return sum + (parseFloat(order.total) || 0);
        }, 0);

        // Monthly revenue
        const monthlyOrders = completedOrders.filter(order => {
            return new Date(order.createdAt) >= lastMonth;
        });

        const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
            return sum + (parseFloat(order.total) || 0);
        }, 0);

        // Order status counts
        const pendingOrders = await db.Order.count({ where: { status: 'pending' } });
        const completedOrdersCount = await db.Order.count({ where: { status: 'completed' } });
        const cancelledOrders = await db.Order.count({ where: { status: 'cancelled' } });

        // Low stock products
        const lowStockProducts = await db.product.count({
            where: {
                stock: {
                    [Op.lte]: 10
                }
            }
        });

        // Sale products count
        const saleProductsCount = await db.product.count({
            where: { is_on_sale: true }
        });

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalCategories,
                totalRevenue: totalRevenue.toFixed(2),
                monthlyRevenue: monthlyRevenue.toFixed(2),
                pendingOrders,
                completedOrders: completedOrdersCount,
                cancelledOrders,
                lowStockProducts,
                saleProductsCount
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats: " + error.message
        });
    }
};

const getSalesAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        let startDate;
        const now = new Date();
        
        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            case 'year':
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        }

        const orders = await db.Order.findAll({
            where: {
                status: 'completed',
                createdAt: {
                    [Op.gte]: startDate
                }
            },
            attributes: ['total', 'createdAt'],
            order: [['createdAt', 'ASC']]
        });

        // Group by date
        const salesData = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!salesData[date]) {
                salesData[date] = 0;
            }
            salesData[date] += parseFloat(order.total) || 0;
        });

        const chartData = Object.keys(salesData).map(date => ({
            date,
            revenue: salesData[date]
        }));

        res.status(200).json({
            success: true,
            salesData: chartData
        });
    } catch (error) {
        console.error("Error fetching sales analytics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching sales analytics: " + error.message
        });
    }
};

const getTopProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get products with their order counts
        const products = await db.product.findAll({
            attributes: ['id', 'name', 'price', 'stock', 'image'],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit)
        });

        // For now, return products by creation date
        // In a real app, you'd track product sales
        const topProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            image: product.image?.[0] || '',
            sales: Math.floor(Math.random() * 100) + 1, // Mock data
            revenue: (product.price * (Math.floor(Math.random() * 100) + 1)).toFixed(2)
        }));

        res.status(200).json({
            success: true,
            topProducts
        });
    } catch (error) {
        console.error("Error fetching top products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching top products: " + error.message
        });
    }
};

const getCategoryAnalytics = async (req, res) => {
    try {
        const categories = await db.parentCategory.findAll({
            include: [
                {
                    model: db.product,
                    as: 'products',
                    attributes: ['id']
                }
            ]
        });

        const categoryStats = categories.map(category => ({
            name: category.name,
            productCount: category.products?.length || 0,
            color: category.color || '#3B82F6'
        }));

        res.status(200).json({
            success: true,
            categoryStats
        });
    } catch (error) {
        console.error("Error fetching category analytics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching category analytics: " + error.message
        });
    }
};

const getRecentActivity = async (req, res) => {
    try {
        const recentOrders = await db.Order.findAll({
            include: [
                {
                    model: db.Payment,
                    as: 'payment'
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        const recentProducts = await db.product.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.status(200).json({
            success: true,
            recentActivity: {
                orders: recentOrders,
                products: recentProducts
            }
        });
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching recent activity: " + error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getSalesAnalytics,
    getTopProducts,
    getCategoryAnalytics,
    getRecentActivity
}; 