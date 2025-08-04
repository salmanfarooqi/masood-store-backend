const express = require("express");
const router = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist, isInWishlist } = require("../../../controllers/buyer/wishlist/wishlist");
const { authenticateToken } = require("../../../midleware");

// Add to wishlist
router.post("/add", authenticateToken, addToWishlist);

// Debug route to check if wishlist router is working
router.get("/test", (req, res) => {
  res.send("Wishlist router is working!");
});

// Remove from wishlist
router.delete("/remove/:productId", authenticateToken, removeFromWishlist);

// Get user's wishlist
router.get("/", authenticateToken, getWishlist);

// Check if product is in wishlist
router.get("/check/:productId", authenticateToken, isInWishlist);

module.exports = router; 