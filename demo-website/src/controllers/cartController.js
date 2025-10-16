import cartService from "../services/cartService.js";

const cartController = {
  getMine: async (req, res) => {
    const userId = req.user.id;
    const cart = await cartService.createIfMissing(userId);
    res.status(200).json(cart);
  },
  addItem: async (req, res) => {
    const userId = req.user.id;
    const { menuId, qty = 1, note } = req.body;

    if (!menuId) {
      return res.status(400).json({ message: "menuId is required" });
    }

    const cart = await cartService.createIfMissing(userId);
    const targetId = String(menuId);
    const idx = cart.items.findIndex((i) => {
      const itemId = i.menuId && i.menuId._id ? i.menuId._id : i.menuId;
      if (itemId && String(itemId) === targetId) return true;
      if (i._id && String(i._id) === targetId) return true;
      return false;
    });
    if (idx >= 0) cart.items[idx].qty += Number(qty);
    else cart.items.push({ menuId, qty: Number(qty), note });

    cart.markModified("items");
    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  },
  updateItem: async (req, res) => {
    const userId = req.user.id;
    const { itemMenuId } = req.params;
    const { qty, note } = req.body;

    const cart = await cartService.createIfMissing(userId);
    const targetId = String(itemMenuId);
    const idx = cart.items.findIndex((i) => {
      const itemId = i.menuId && i.menuId._id ? i.menuId._id : i.menuId;
      if (itemId && String(itemId) === targetId) return true;
      if (i._id && String(i._id) === targetId) return true;
      return false;
    });
    if (idx < 0) return res.status(404).json({ message: "Item not found" });

    if (qty !== undefined) cart.items[idx].qty = Number(qty);
    if (note !== undefined) cart.items[idx].note = note;

    cart.markModified("items");
    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  },
  removeItem: async (req, res) => {
    const userId = req.user.id;
    const { itemMenuId } = req.params;

    const cart = await cartService.createIfMissing(userId);
    const targetId = String(itemMenuId);
    cart.items = cart.items.filter((i) => {
      const itemId = i.menuId && i.menuId._id ? i.menuId._id : i.menuId;
      if (itemId && String(itemId) === targetId) return false;
      if (i._id && String(i._id) === targetId) return false;
      return true;
    });

    cart.markModified("items");
    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  },
  addCustomItem: async (req, res) => {
    const userId = req.user.id;
    const {
      name,
      basePrice,
      options = [],
      totalPrice,
      qty = 1,
      note,
    } = req.body;

    if (!name || !totalPrice) {
      return res
        .status(400)
        .json({ message: "Custom item requires name and total price" });
    }

    const cart = await cartService.createIfMissing(userId);
    cart.items.push({
      qty: Number(qty) || 1,
      note,
      custom: {
        name,
        basePrice,
        options,
        totalPrice,
      },
    });

    cart.markModified("items");
    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  },
  clear: async (req, res) => {
    const userId = req.user.id;
    const cart = await cartService.createIfMissing(userId);
    cart.items = [];
    cart.markModified("items");
    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  },
};

export default cartController;
