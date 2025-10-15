import Order from '../models/Order.js';

export default {
  listMine: (userId) => Order.find({ userId }).sort({ createdAt: -1 }),
  get: (id) => Order.findById(id),
  create: (payload) => Order.create(payload),
  updateStatus: (id, status) => Order.findByIdAndUpdate(id, { status }, { new: true }),

  listAll: (filter = {}) => Order.find(filter).sort({ createdAt: -1 }),
  countByStatus: async () => {
    const all = await Order.find({}).select('status createdAt items totalPrice').lean();
    const mapped = all.map(o => {
      const firstItem = (o.items && o.items[0]) || {};
      const uiStatus = (o.status === 'completed') ? 'Served'
                     : (o.status === 'preparing') ? 'In Process'
                     : o.status;
      return {
        id: o._id.toString(),
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-',
        price: o.totalPrice ?? 0,
        base: firstItem.nameSnap ?? '-',
        ingredients: (firstItem.toppings || []).map(t => t.nameSnap),
        status: uiStatus
      };
    });
    return {
      total: mapped.length,
      inProcess: mapped.filter(x => x.status === 'In Process').length,
      served: mapped.filter(x => x.status === 'Served').length,
      mappedAll: mapped
    };
  }
};