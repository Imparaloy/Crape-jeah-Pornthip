import Cart from '../models/Cart.js';

const cartService = {
  getMine: async (userId) => Cart.findOne({ userId }),
  createIfMissing: async (userId) => {
    const existed = await Cart.findOne({ userId });
    if (existed) return existed;
    return Cart.create({ userId, items: [] });
  },
  set: async (userId, cart) => {
    return Cart.findOneAndUpdate({ userId }, cart, { new: true, upsert: true });
  }
};

export default cartService;
