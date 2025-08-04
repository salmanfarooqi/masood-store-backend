const express=require('express')
const { buyerSignup, buyerLogin, getUser } = require('../../../controllers/buyer/auth/auth')
const { authenticateToken } = require('../../../midleware')

const buyerauthRouter=express.Router()
buyerauthRouter.post('/signup',buyerSignup)
buyerauthRouter.post('/login',buyerLogin)
// buyerauthRouter.get('/getUser', authenticateToken,getUser)

module.exports={buyerauthRouter}