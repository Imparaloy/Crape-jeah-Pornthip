import Order from '../models/Order.js';
import Menu from '../models/menu.js';

const orderService = {
  listMine: async (userId, limit = 10) => {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('items.productId', 'name description')
      .lean();
    return orders.map(normalizeOrderForDisplay);
  },
  get: async (id) => {
    const order = await Order.findById(id)
      .populate('items.productId', 'name description')
      .lean();
    if (!order) return order;
    return normalizeOrderForDisplay(order);
  },
  create: (payload) => Order.create(payload),
  updateStatus: (id, status) => Order.findByIdAndUpdate(id, { status }, { new: true }),
  getLatest: async (userId) => {
    const order = await Order.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name description')
      .lean();
    if (!order) return order;
    return normalizeOrderForDisplay(order);
  },
  createFromCart: async (userId, cart, note) => {
    // Ensure menu data is available (name/price) for non-custom items
    try {
      if (cart && typeof cart.populate === 'function') {
        await cart.populate('items.menuId');
      }
    } catch (_) {
      // ignore populate errors; we'll do a manual lookup below if needed
    }

    // Manual lookup for any items that still don't have menu name/price
    const rawItems = Array.isArray(cart?.items) ? cart.items : [];
    const missingIds = [];
    rawItems.forEach((i) => {
      if (i?.custom) return;
      const menuObj = i?.menuId;
      const hasData = menuObj && typeof menuObj === 'object' && ('name' in menuObj || 'price' in menuObj);
      if (!hasData) {
        const id = menuObj && (menuObj._id || menuObj);
        if (id) missingIds.push(String(id));
      }
    });

    const menuMap = new Map();
    if (missingIds.length) {
      const menus = await Menu.find({ _id: { $in: missingIds } }, 'name price');
      menus.forEach((m) => menuMap.set(String(m._id), m));
    }

    const items = rawItems.map((i) => {
      const isCustom = !!(i?.custom && (
        (typeof i.custom.name === 'string' && i.custom.name.trim() !== '') ||
        (i.custom.totalPrice != null && !Number.isNaN(Number(i.custom.totalPrice))) ||
        (Array.isArray(i.custom.options) && i.custom.options.length > 0)
      ));
      const qty = Number(i?.qty) || 1;

      let menuDoc = null;
      if (!isCustom) {
        const id = i?.menuId && (i.menuId._id || i.menuId);
        if (i?.menuId && typeof i.menuId === 'object' && (i.menuId.name || i.menuId.price)) {
          menuDoc = i.menuId;
        } else if (id && menuMap.has(String(id))) {
          menuDoc = menuMap.get(String(id));
        }
      }

      const name = isCustom
        ? (i?.custom?.name || 'เมนู')
        : (menuDoc?.name || i?.menuId?.name || 'เมนู');

      const unit = isCustom
        ? (Number(i?.custom?.totalPrice) || 0) / qty
        : Number(menuDoc?.price ?? i?.menuId?.price ?? 0);

      const detail = isCustom && Array.isArray(i?.custom?.options)
        ? i.custom.options
            .map((op) => `${op.group}: ${op.name}${op.price ? ` (+${op.price}฿)` : ''}`)
            .join(', ')
        : (i?.note || menuDoc?.description || '');

      return {
        productId: isCustom ? undefined : (i?.menuId?._id || i?.menuId),
        nameSnap: name,
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

// Helpers
function normalizeOrderForDisplay(order) {
  if (!order) return order;
  const clone = { ...order };
  clone.items = (order.items || []).map((it) => {
    const product = it.productId;
    const isPlaceholder = !it.nameSnap || it.nameSnap === 'เมนูพิเศษ' || it.nameSnap === 'เมนู';
    const resolvedName = (!isPlaceholder)
      ? it.nameSnap
      : (product && typeof product === 'object' && product.name) ? product.name : (it.nameSnap || 'เมนู');
    const resolvedDetails = (it.detailsSnap && String(it.detailsSnap).trim() !== '' && it.detailsSnap !== '-')
      ? it.detailsSnap
      : ((product && typeof product === 'object' && product.description) ? product.description : it.detailsSnap);
    return { ...it, nameSnap: resolvedName, detailsSnap: resolvedDetails };
  });
  return clone;
}
