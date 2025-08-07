const { where, Op } = require("sequelize");
const db = require("../../../models")

const getAllProductByBuyer = async (req, res) => {
  try {
    console.log("getAllProductByBuyer called");
    console.log("Database object:", typeof db);
    console.log("Product model:", typeof db.product);
    
    const { categoryId, search, onSale, sortBy, sortOrder } = req.query;
    console.log("Cat...", categoryId, "Search...", search);
    
    const queryOptions = {};

    // Build where conditions
    let whereConditions = {};

    // Category filter
    if (categoryId) {
      whereConditions.parent_category = categoryId;
    }

    // Sale filter
    if (onSale === 'true') {
      whereConditions.is_on_sale = true;
    }

    // Search filter
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions[Op.or] = [
        { name: { [Op.like]: searchTerm } },
        { description: { [Op.like]: searchTerm } }
      ];
    }

    // Only add where clause if we have conditions
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    // Sorting
    if (sortBy) {
      queryOptions.order = [[sortBy, sortOrder || 'ASC']];
    } else {
      queryOptions.order = [['createdAt', 'DESC']];
    }

    console.log("Query options:", JSON.stringify(queryOptions, null, 2));

    const products = await db.product.findAll(queryOptions);
    console.log("Products found:", products ? products.length : 0);
    
    if (products && products.length > 0) {
      return res.status(200).json(products);
    }

    return res.status(200).json([]); // Return empty array instead of 204
  } catch (error) {
    console.error("Error in getAllProductByBuyer:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getSaleProducts = async (req, res) => {
  try {
    const products = await db.product.findAll({
      where: {
        is_on_sale: true
      },
      order: [['sale_percentage', 'DESC']]
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error in getSaleProducts:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const buyerGetProductById=async(req,res)=>{
  const {productId}=req.params;
  console.log("params",productId)
  try {
    
       let products=await db.product.findOne({
        where:{
          id:productId
        }
       })

       console.log("rpd",products)
       if(!products){
        res.status(404).send("no product found")
       }
       res.status(200).send(products)
  } catch (error) {
    
  }
}

module.exports={getAllProductByBuyer, buyerGetProductById, getSaleProducts}