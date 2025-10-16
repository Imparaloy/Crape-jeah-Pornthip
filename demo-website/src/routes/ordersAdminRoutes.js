// src/routes/ordersAdminRoutes.js
import express from 'express';
import Order from '../models/Order.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { listOrdersAdmin, updateOrderStatusAdmin } from '../controllers/ordersAdminController.js';

const r = express.Router();

const toUiStatus = (db) =>
  db === 'completed' ? 'Served' :
  db === 'cancelled' ? 'Cancelled' : 'In Process';

// GET /admin/orders (admin only)
r.get('/admin/orders', authMiddleware('admin'), async (req, res, next) => {
  try {
    const tab = req.query.status ?? 'all';
    const match =
      tab === 'served' ? { status: 'completed' } :
      tab === 'in'     ? { status: { $in: ['pending','paid','preparing'] } } :
                         {};

    const rows = await Order.find(match).sort({ createdAt: -1 }).lean();

    const viewOrders = rows.map((r) => {
      const first = r.items?.[0];
      const created = r.createdAt ?? r._id?.getTimestamp?.();
      return {
        id: String(r._id),
        idShort: String(r._id).slice(-6),
        time: created ? new Date(created).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'}) : '-',
        price: r.totalPrice ?? 0,
        base: first?.nameSnap ?? '-',
        details: (typeof r.detailsSnap === 'string' && r.detailsSnap.trim()) ? r.detailsSnap.trim() : '-',
        status: toUiStatus(r.status),
      };
    });

    const [total, inProcess, served] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ status: { $in: ['pending','paid','preparing'] } }),
      Order.countDocuments({ status: 'completed' }),
    ]);

    res.render('order-admin', {
      orders: viewOrders,
      counters: { total, inProcess, served },
      activeTab: tab,
      activePath: '/admin/orders',   // <- สำคัญสำหรับ navbar ไฮไลต์
      me: req.user || null,
    });
  } catch (err) { next(err); }
});

// PUT /admin/orders/:id/status (admin only)
r.put('/admin/orders/:id/status', authMiddleware('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await Order.findById(id).lean();
    if (!current) return res.status(404).json({ ok: false, message: 'Order not found' });

    const nextDbStatus = current.status === 'completed' ? 'preparing' : 'completed';
    const updated = await Order.findByIdAndUpdate(id, { status: nextDbStatus }, { new: true }).lean();

    res.json({ ok: true, id: String(updated._id), status: updated.status });
  } catch (err) { next(err); }
});

const useOrdersAdminRoutes = async (router) => {
  router.use(r);
};

export default useOrdersAdminRoutes;
