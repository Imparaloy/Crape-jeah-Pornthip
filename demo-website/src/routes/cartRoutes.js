const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const asyncHandler = require('../middlewares/asyncHandler');

// Get cart
router.get('/api/cart', asyncHandler(cartController.getCart));

// Add item to cart
router.post('/api/cart/add', asyncHandler(cartController.addToCart));

// Remove item from cart
router.delete('/api/cart/remove/:menuId', asyncHandler(cartController.removeFromCart));

// Update item quantity
router.put('/api/cart/update/:menuId', asyncHandler(cartController.updateCartItemQuantity));

// Clear cart
router.delete('/api/cart/clear', asyncHandler(cartController.clearCart));

module.exports = router;