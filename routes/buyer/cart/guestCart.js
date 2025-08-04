const express=require('express')
const { addToGuestCart, getGuestCart } = require('../../../controllers/buyer/cart/cart')
const guestCartRouter=express.Router()

guestCartRouter.post('/addToGuestCart',addToGuestCart)
guestCartRouter.get('/getGuestCart/:guestId',getGuestCart)

module.exports={guestCartRouter} 