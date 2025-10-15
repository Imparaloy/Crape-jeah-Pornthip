import Order from '../models/Order.js';

const orderService = {
  listMine: (userId, limit = 10) => Order.find({ userId }).sort({ createdAt: -1 }).limit(limit),
  get: (id) => Order.findById(id),
  create: (payload) => Order.create(payload),
  updateStatus: (id, status) => Order.findByIdAndUpdate(id, { status }, { new: true }),
  getLatest: (userId) => Order.findOne({ userId }).sort({ createdAt: -1 }),
  createFromCart: async (userId, cart, note) => {
    const items = (cart.items || []).map(i => {
      const isCustom = !!i.custom;
      const name = isCustom ? i.custom.name : (i.menuId && i.menuId.name);
      const unit = isCustom ? Number(i.custom.totalPrice) / (Number(i.qty)||1) : Number(i.menuId?.price || 0);
      const qty = Number(i.qty) || 1;
      const detail = isCustom && Array.isArray(i.custom.options) ? i.custom.options.map(op => `${op.group}: ${op.name}${op.price ? ` (+${op.price}฿)` : ''}`).join(', ') : (i.note || '');
      return {
        productId: isCustom ? undefined : (i.menuId?._id || i.menuId),
        nameSnap: name || 'เมนูพิเศษ',
        unitPriceSnap: Number(unit) || 0,
        quantity: qty,
        toppings: [],
        detailsSnap: detail,
        linePrice: (Number(unit) || 0) * qty,
      };
    });
    const total = items.reduce((s, it) => s + (it.linePrice || 0), 0);
    const order = await Order.create({ userId, items, totalPrice: total, status: 'pending', note });
    return order;
  }
};

export default orderService;
