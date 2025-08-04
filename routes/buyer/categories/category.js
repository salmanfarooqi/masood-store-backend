const express=require('express')
const { getAllParentCategroyByBuyer, getAllChildCategroyByBuyer } = require('../../../controllers/buyer/categories/Category')


const BuyerCategoryRouter=express.Router()

BuyerCategoryRouter.get('/getAllParentCategory',getAllParentCategroyByBuyer)
BuyerCategoryRouter.get('/getAllChildCategory',getAllChildCategroyByBuyer)
module.exports=BuyerCategoryRouter