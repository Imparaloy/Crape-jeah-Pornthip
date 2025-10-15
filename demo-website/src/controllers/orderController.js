import orderService from '../services/orderService.js';

const uiTabToMongoStatus = (tab) => {
  if (tab === 'served') return 'completed';
  if (tab === 'in') return 'preparing';
  return undefined;
};

export const listForKitchen = async (req, res, next) => {
  try {
    const activeTab = (req.query.status || 'all').toLowerCase();
    const mongoStatus = uiTabToMongoStatus(activeTab);

    const { total, inProcess, served, mappedAll } = await orderService.countByStatus();

    const orders =
      activeTab === 'all' ? mappedAll
      : mappedAll.filter(o => activeTab === 'in' ? o.status === 'In Process' : o.status === 'Served');

    const counters = { total, inProcess, served };

    return res.render('order-admin', { orders, counters, activeTab });
  } catch (err) {
    next(err);
  }
};
