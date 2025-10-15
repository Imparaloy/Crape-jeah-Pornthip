import express from 'express';
import Order from '../models/Order.js';

const useOrdersRoute = async (router) => {
  router.get('/orders', async (req, res, next) => {
    try {
      const tab = req.query.status ?? 'all';

      const match =
        tab === 'served' ? { status: 'completed' } :
        tab === 'in'     ? { status: { $in: ['pending', 'paid', 'preparing'] } } :
                           {};

      const rows = await Order.find(match).sort({ createdAt: -1 }).lean();

      const toUiStatus = (db) =>
        db === 'completed' ? 'Served'
        : db === 'cancelled' ? 'Cancelled'
        : 'In Process';

      const viewOrders =
        rows.map((r) => {
          const firstItem = r.items?.[0];
          const ingredientsFlat = (r.items || [])
            .flatMap(it => (it.toppings || []).map(t => t.nameSnap))
            .filter(Boolean);

          return {
            id: String(r._id),
            idShort: String(r._id).slice(-6),

            time: new Date(r.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            price: r.totalPrice ?? 0,
            base: firstItem?.nameSnap ?? '-',
            ingredients: ingredientsFlat,
            status: toUiStatus(r.status),
          };
        });

      const [total, inProcess, served] = await Promise.all([
        Order.countDocuments({}),
        Order.countDocuments({ status: { $in: ['pending', 'paid', 'preparing'] } }),
        Order.countDocuments({ status: 'completed' }),
      ]);

      res.render('order-admin', {
        orders: viewOrders,
        counters: { total, inProcess, served },
        activeTab: tab,
      });
    } catch (err) {
      next(err);
    }
  });

router.put('/orders/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;

    const current = await Order.findById(id).lean();
    if (!current) return res.status(404).json({ ok: false, message: 'Order not found' });

    const nextDbStatus = current.status === 'completed' ? 'preparing' : 'completed';

    const updated = await Order.findByIdAndUpdate(
      id,
      { status: nextDbStatus },
      { new: true }
    ).lean();

    return res.json({ ok: true, id: String(updated._id), status: updated.status });
  } catch (err) {
    next(err);
  }
});
};

export default useOrdersRoute;
