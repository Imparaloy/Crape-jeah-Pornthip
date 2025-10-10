import Order from '../models/Order.js';

export default {
  listMine: (userId) => Order.find({ userId }).sort({ createdAt: -1 }),
  get: (id) => Order.findById(id),
  create: (payload) => Order.create(payload),
  updateStatus: (id, status) => Order.findByIdAndUpdate(id, { status }, { new: true }),
};
