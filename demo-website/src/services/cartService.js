const Cart = require('../models/cart');

const getCartByUserId = async (userId) => {
  return await Cart.findOne({ userId }).populate('items.menu');
};

const addItemToCart = async (userId, menuId, quantity = 1, customizations = []) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(item => item.menu.toString() === menuId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      menu: menuId,
      quantity,
      customizations,
      price: 0
    });
  }

  await cart.save();
  return cart;
};

const removeItemFromCart = async (userId, menuId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');
  cart.items = cart.items.filter(item => item.menu.toString() !== menuId);
  await cart.save();
  return cart;
};

const updateItemQuantity = async (userId, menuId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');
  const item = cart.items.find(item => item.menu.toString() === menuId);
  if (!item) throw new Error('Item not found in cart');
  item.quantity = quantity;
  if (quantity <= 0) {
    cart.items = cart.items.filter(item => item.menu.toString() !== menuId);
  }
  await cart.save();
  return cart;
};

const clearCartByUserId = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');
  cart.items = [];
  await cart.save();
  return cart;
};

module.exports = {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCartByUserId,
};
