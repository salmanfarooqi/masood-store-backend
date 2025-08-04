const express=require('express')
const { getAllProductByBuyer, buyerGetProductById, getSaleProducts } = require('../../../controllers/buyer/products/product')
const buyerProductRouter=express.Router()
buyerProductRouter.get('/getProducts',getAllProductByBuyer)
buyerProductRouter.get('/getSaleProducts',getSaleProducts)
// buyerProductRouter.get('/getproductByid/id',buyerProductRouter)
buyerProductRouter.get('/getproductByid/:productId',buyerGetProductById);

module.exports=buyerProductRouter