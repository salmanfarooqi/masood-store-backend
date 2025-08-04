const express=require('express')
const { addToCart, addToGuestCart, getAllCartProduct, updateCartQuantity, deleteCartItem } = require('../../../controllers/buyer/cart/cart')
const { authenticateToken } = require('../../../midleware')
const cartRouter=express.Router()
cartRouter.post('/addToCart',authenticateToken,addToCart)
cartRouter.post('/addToGuestCart',addToGuestCart)
cartRouter.get('/getCart',authenticateToken,getAllCartProduct)
cartRouter.put('/updateCart',authenticateToken,updateCartQuantity)
cartRouter.delete('/deleteCartItem/:cartId',authenticateToken,deleteCartItem)

module.exports={cartRouter}