const db = require("../../../models");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await db.product.findOne({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if already in wishlist
    const existingWishlist = await db.Wishlist.findOne({
      where: {
        user_id: userId,
        product_id: productId
      }
    });

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    // Add to wishlist
    await db.Wishlist.create({
      user_id: userId,
      product_id: productId
    });

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully"
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding to wishlist"
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await db.Wishlist.findOne({
      where: {
        user_id: userId,
        product_id: productId
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist"
      });
    }

    await wishlistItem.destroy();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully"
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while removing from wishlist"
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await db.Wishlist.findAll({
      where: {
        user_id: userId
      }
    });

    // Fetch product details for each wishlist item
    const wishlistWithProducts = await Promise.all(
      wishlistItems.map(async (wishlistItem) => {
        const product = await db.product.findOne({
          where: { id: wishlistItem.product_id },
          attributes: ['id', 'name', 'price', 'image', 'colors', 'is_on_sale', 'sale_price', 'sale_percentage']
        });
        
        return {
          id: wishlistItem.id,
          product: product,
          added_at: wishlistItem.added_at
        };
      })
    );

    return res.status(200).json({
      success: true,
      wishlist: wishlistWithProducts
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching wishlist"
    });
  }
};

const isInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await db.Wishlist.findOne({
      where: {
        user_id: userId,
        product_id: productId
      }
    });

    return res.status(200).json({
      success: true,
      isInWishlist: !!wishlistItem
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking wishlist status"
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist
}; 