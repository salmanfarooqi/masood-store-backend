const express = require('express');
const { createGuestOrder, getGuestOrder, getGuestOrdersByEmail } = require('../../../controllers/buyer/orders/guestOrder');

const guestOrderRouter = express.Router();

// Route for creating guest orders (no authentication required)
guestOrderRouter.post('/guest-order', createGuestOrder);

// Route for getting guest order by ID (no authentication required)
guestOrderRouter.get('/guest-order/:orderId', getGuestOrder);

// Route for getting guest orders by email/phone (no authentication required)
guestOrderRouter.post('/guest-orders/search', getGuestOrdersByEmail);

module.exports = guestOrderRouter; 