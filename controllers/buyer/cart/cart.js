const { where } = require("sequelize");
const db = require("../../../models")

const addToCart = async (req, res) => {
  try {
      const { productId, quantity = 1 } = req.body;
      const userId = req.user.id;

      console.log("=== ADD TO CART DEBUG ===");
      console.log("Request body:", req.body);
      console.log("userId:", userId, "type:", typeof userId);
      console.log("productId:", productId, "type:", typeof productId);
      console.log("quantity:", quantity, "type:", typeof quantity);

      // Check if product exists
      const product = await db.product.findOne({
          where: { id: productId }
      });

      if (!product) {
          return res.status(404).send("Product not found");
      }

      // Check if product is in stock
      if (product.stock < quantity) {
          return res.status(404).send("Product is out of stock");
      }

      const productPrice = Number( product.price);
      const totalPrice =Number( quantity * productPrice);

      console.log("Searching for cart item - userId:", userId, "productId:", productId);
      
      let cart = await db.Cart.findOne({
          where: { 
              user_id: userId,
              product_id: productId
          }
      });

      console.log("Found existing cart item:", cart ? "YES" : "NO");

      if (cart) {
          // Update existing cart item - add to existing quantity
          const oldQuantity = cart.quantity;
          cart.quantity += quantity;
          cart.total = cart.quantity * productPrice;
          await cart.save(); 
          console.log("----update existing cart item - old qty:", oldQuantity, "new qty:", cart.quantity, "added:", quantity)
      } else {
          // Create new cart item
          cart = await db.Cart.create({
              product_id: productId,
              quantity: quantity,
              total: totalPrice,
              user_id: userId
          });

          console.log("----create new cart item - qty:", quantity, "total:", totalPrice)
      }

      // Optionally, update product stock
      product.stock -= quantity;
      await product.save();

      console.log("Cart updated", cart);

      return res.status(201).send("Product successfully added to cart");
  } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while adding product to cart");
  }
};

// Guest cart functionality
const addToGuestCart = async (req, res) => {
  try {
      const { productId, quantity = 1, guestId } = req.body;

      console.log("=== GUEST CART DEBUG ===");
      console.log("Request body:", req.body);

      // Check if product exists
      const product = await db.product.findOne({
          where: { id: productId }
      });

      if (!product) {
          return res.status(404).send("Product not found");
      }

      // Check if product is in stock
      if (product.stock < quantity) {
          return res.status(400).send("Product is out of stock");
      }

      const productPrice = Number(product.price);
      const totalPrice = Number(quantity * productPrice);

      // For guest cart, we'll store in session or use a temporary storage
      // For now, we'll return the cart item data to be stored on frontend
      const cartItem = {
          id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product_id: productId,
          quantity: quantity,
          total: totalPrice,
          guest_id: guestId,
          product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              description: product.description,
              colors: product.colors,
              size: product.size,
              stock: product.stock
          }
      };

      console.log("Created guest cart item:", cartItem);

      return res.status(201).json({
          message: "Product successfully added to guest cart",
          cartItem: cartItem
      });
  } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while adding product to cart");
  }
};

// Get guest cart items - This was missing!
const getGuestCart = async (req, res) => {
  try {
      const { guestId } = req.params;
      
      console.log("=== GET GUEST CART DEBUG ===");
      console.log("Guest ID:", guestId);

      // Since guest cart items are stored on frontend, 
      // we'll return a simple response indicating guest cart functionality
      // In a production app, you might store guest cart in Redis or temporary storage
      
      return res.status(200).json({
          success: true,
          message: "Guest cart retrieved",
          cartItems: [], // Guest cart items should be managed on frontend
          guestId: guestId
      });
  } catch (error) {
      console.error("Error getting guest cart:", error);
      return res.status(500).json({
          success: false,
          message: "An error occurred while getting guest cart"
      });
  }
};



    
const getAllCartProduct = async (req, res) => {
  try {
    const userId = String(req.user.id); // Ensure userId is a string
   console.log("UseR",userId)
    let cartItems = await db.Cart.findAll({
      where: {
        user_id: userId
      },
      include: [
        {
          model: db.product,  // Include the Product model
          as: 'product',      // Alias for the relationship
          attributes: ['id', 'name', 'price', 'image', 'colors', 'size', 'stock'] // Include variant fields for checkout
        }
      ]
    });

    console.log("CartItems", cartItems);

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json([]);
    }

   
    res.status(200).send(cartItems); // Send the product information
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Internal server error"); // Send a generic error message
  }
};




const updateCartQuantity = async (req, res) => {
    try {
      let { quantity, cartId } = req.body;
  
      // Check if the cart exists
      let isCartExist = await db.Cart.findOne({
        where: {
          id: cartId,
        },
      });
  
      // If the cart does not exist, return a 404 error
      if (!isCartExist) {
        return res.status(404).send("Cart not found");
      }
  
      // Update the quantity
      isCartExist.quantity = quantity;
  
      // Save the updated cart
      await isCartExist.save();
  
      // Send a success response
      return res.status(200).send("Cart quantity updated successfully");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  const deleteCartItem = async (req, res) => {
    try {
      let { cartId } = req.params;
      
      // Find the cart item by id
      let isCartExist = await db.Cart.findOne({
        where: {
          id: cartId
        }
      });
  
      // Log the cart object for debugging
      console.log("CartExist", cartId);
      
      // Check if the cart item exists
      if (!isCartExist) {
        return res.status(404).send("No cart found");
      }
  
      // Delete the cart item if it exists
      await isCartExist.destroy();
      return res.status(200).send("Item is deleted successfully");
  
    } catch (error) {
      // Send error response in case of an exception
      return res.status(500).json({ message: error.message });
    }
  };
  
  

module.exports={addToCart,addToGuestCart,getGuestCart,getAllCartProduct,updateCartQuantity,deleteCartItem}