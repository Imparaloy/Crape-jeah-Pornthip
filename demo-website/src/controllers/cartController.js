const cartService = require('../services/cartService');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'temp-user-1';
    const cart = await cartService.getCartByUserId(userId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'temp-user-1';
    const { menuId, quantity, customizations } = req.body;
    const cart = await cartService.addItemToCart(userId, menuId, quantity, customizations);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'temp-user-1';
    const cart = await cartService.removeItemFromCart(userId, req.params.menuId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'temp-user-1';
    const { quantity } = req.body;
    const cart = await cartService.updateItemQuantity(userId, req.params.menuId, quantity);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'temp-user-1';
    const cart = await cartService.clearCartByUserId(userId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
};