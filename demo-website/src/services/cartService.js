import Cart from "../models/Cart.js";

const cartService = {
  getMine: async (userId) => Cart.findOne({ userId }).populate("items.menuId"),
  createIfMissing: async (userId) => {
    const existed = await Cart.findOne({ userId }).populate("items.menuId");
    if (existed) return existed;
    const created = await Cart.create({ userId, items: [] });
    return Cart.findById(created.id).populate("items.menuId");
  },
  set: async (userId, cart) => {
    if (cart && typeof cart.save === "function") {
      await cart.save();
      await cart.populate("items.menuId");
      return cart;
    }
    return Cart.findOneAndUpdate({ userId }, cart, {
      new: true,
      upsert: true,
    }).populate("items.menuId");
  },
};

export default cartService;
