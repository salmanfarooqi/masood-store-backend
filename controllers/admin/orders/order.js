const db = require("../../../models");

const getAllOrders = async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            include: [
                {
                    model: db.Payment,
                    as: 'payment'
                },
                {
                    model: db.shipmentDetail,
                    as: 'shipment'
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders: " + error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await db.Order.findByPk(id, {
            include: [
                {
                    model: db.Payment,
                    as: 'payment'
                },
                {
                    model: db.shipmentDetail,
                    as: 'shipment'
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching order: " + error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await db.Order.findByPk(id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        await order.update({ status });

        res.status(200).json({
            success: true,
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Error updating order status: " + error.message
        });
    }
};

const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await db.Order.count();
        const pendingOrders = await db.Order.count({ where: { status: 'pending' } });
        const completedOrders = await db.Order.count({ where: { status: 'completed' } });
        const cancelledOrders = await db.Order.count({ where: { status: 'cancelled' } });

        // Calculate total revenue
        const completedOrdersData = await db.Order.findAll({
            where: { status: 'completed' },
            attributes: ['total']
        });

        const totalRevenue = completedOrdersData.reduce((sum, order) => {
            return sum + (parseFloat(order.total) || 0);
        }, 0);

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue: totalRevenue.toFixed(2)
            }
        });
    } catch (error) {
        console.error("Error fetching order stats:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching order stats: " + error.message
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await db.Order.findByPk(id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        await order.destroy();

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting order: " + error.message
        });
    }
};

const getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await db.Order.findAll({
            include: [
                {
                    model: db.Payment,
                    as: 'payment'
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        res.status(200).json({
            success: true,
            orders: recentOrders
        });
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching recent orders: " + error.message
        });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrderStats,
    deleteOrder,
    getRecentOrders
}; 