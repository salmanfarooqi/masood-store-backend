const express=require('express')
const { createOrder } = require('../../../controllers/buyer/payments/payment')
buyerPaymentRouter=express.Router()
buyerPaymentRouter.post('/addPayments',createOrder)
module.exports=buyerPaymentRouter