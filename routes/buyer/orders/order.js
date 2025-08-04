const express=require('express')

const {getOrder, addOrder}=require('../../../controllers/buyer/orders/order')
buyerOrderRouter=express.Router()
buyerOrderRouter.post('/addOrder',addOrder)
buyerOrderRouter.get('/orders',getOrder)
module.exports=buyerOrderRouter