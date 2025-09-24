import cartService from '../services/cartService.js';

const cartController = {
  getMine: async (req, res) => {
    const userId = req.user.id;
    const cart = await cartService.createIfMissing(userId);
    res.status(200).json(cart);
  },
  addItem: async (req, res) => {
    const userId = req.user.id;
    const { menuId, qty = 1, note } = req.body;

    const cart = await cartService.createIfMissing(userId);
    const idx = cart.items.findIndex(i => i.menuId.toString() === String(menuId));
    if (idx >= 0) cart.items[idx].qty += Number(qty);
    else cart.items.push({ menuId, qty: Number(qty), note });

    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  },
  updateItem: async (req, res) => {
    const userId = req.user.id;
    const { itemMenuId } = req.params;
    const { qty, note } = req.body;

    const cart = await cartService.createIfMissing(userId);
    const idx = cart.items.findIndex(i => i.menuId.toString() === String(itemMenuId));
    if (idx < 0) return res.status(404).json({ message: 'Item not found' });

    if (qty !== undefined) cart.items[idx].qty = Number(qty);
    if (note !== undefined) cart.items[idx].note = note;

    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  },
  removeItem: async (req, res) => {
    const userId = req.user.id;
    const { itemMenuId } = req.params;

    const cart = await cartService.createIfMissing(userId);
    cart.items = cart.items.filter(i => i.menuId.toString() !== String(itemMenuId));

    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  },
  clear: async (req, res) => {
    const userId = req.user.id;
    const cart = await cartService.createIfMissing(userId);
    cart.items = [];
    const saved = await cartService.set(userId, cart);
    res.status(200).json(saved);
  }
};

export default cartController;
