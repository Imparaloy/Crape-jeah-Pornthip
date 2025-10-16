import mongoose from 'mongoose';
import Order from '../models/Order.js';

const uiStatus = (db) => (
  db === 'completed' ? 'Served' :
  db === 'cancelled' ? 'Cancelled' : 'In Process'
);

const fallbackTimeFromId = (order) => {
  try {
    return new mongoose.Types.ObjectId(order._id).getTimestamp();
  } catch {
    return null;
  }
};

const computeItemLinePrice = (item) => {
  if (typeof item?.linePrice === 'number') return item.linePrice;

  const toppingsTotal = (item?.toppings || []).reduce(
    (acc, topping) => acc + (Number(topping?.priceSnap) || 0),
    0
  );

  const unitPrice = Number(item?.unitPriceSnap) || 0;
  const quantity = Number(item?.quantity) || 0;

  return (unitPrice + toppingsTotal) * quantity;
};

const computeTotal = (order) => {
  if (typeof order?.totalPrice === 'number') return order.totalPrice;
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.reduce((sum, item) => sum + computeItemLinePrice(item), 0);
};

const itemsToView = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  if (!items.length) return [];

  return items.map((item, idx) => {
    const toppings = Array.isArray(item?.toppings) ? item.toppings : [];
    const details = (item?.detailsSnap || '').toString().trim();

    return {
      idx,
      name: item?.nameSnap || '-',
      quantity: Number(item?.quantity) || 0,
      unitPrice: Number(item?.unitPriceSnap) || 0,
      linePrice: computeItemLinePrice(item),
      toppings: toppings
        .map((topping) => topping?.nameSnap)
        .filter((name) => typeof name === 'string' && name.trim().length > 0),
      details,
    };
  });
};

const toView = (order) => {
  const created = order?.createdAt
    ? new Date(order.createdAt)
    : fallbackTimeFromId(order);

  const time = created
    ? created.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    : '-';

  return {
    id: String(order._id),
    idShort: String(order._id).slice(-6),
    orderNumber: typeof order?.orderNumber === 'number' ? order.orderNumber : null,
    time,
    price: computeTotal(order),
    items: itemsToView(order),
    note: (order?.note || '').toString().trim(),
    status: uiStatus(order?.status),
  };
};

export const listOrdersAdmin = async (req, res, next) => {
  console.log('[ordersAdmin] HIT /orders');

  try {
    const activeTab = ['all', 'in', 'served'].includes(req.query.status)
      ? req.query.status
      : 'all';

    const match =
      activeTab === 'served'
        ? { status: 'completed' }
        : activeTab === 'in'
        ? { status: { $in: ['pending', 'paid', 'preparing'] } }
        : {};

    const docs = await Order.find(match)
      .select('createdAt items totalPrice status orderNumber note')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const [total, inProcess, served] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ status: { $in: ['pending', 'paid', 'preparing'] } }),
      Order.countDocuments({ status: 'completed' }),
    ]);

    const orders = docs.map(toView);

    console.log('[ordersAdmin] docs:', docs.length, 'counters:', {
      total,
      inProcess,
      served,
    });

    res.render('order-admin', {
      orders,
      counters: { total, inProcess, served },
      activeTab,
      activePath: '/orders',
      me: req.user || null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentUiStatus } = req.body; // expected 'In Process'

    if (currentUiStatus !== 'In Process') {
      return res.status(400).json({
        ok: false,
        message: 'Served orders cannot be moved back to In Process.',
      });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ ok: false, message: 'Order not found' });
    }

    res.json({ ok: true, id: String(updated._id), status: updated.status });
  } catch (err) {
    next(err);
  }
};
