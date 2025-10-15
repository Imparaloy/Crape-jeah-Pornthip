import cartService from '../services/cartService.js';
import orderService from '../services/orderService.js';

const ordersController = {
  createFromMyCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { note } = req.body || {};
      const cart = await cartService.createIfMissing(userId);
      if (!cart.items || cart.items.length === 0) {
        return res.status(400).json({ message: 'ตะกร้าว่าง ไม่สามารถสร้างออเดอร์ได้' });
      }
      const order = await orderService.createFromCart(userId, cart, note);
      // clear cart after place order
      cart.items = [];
      await cartService.set(userId, cart);
      res.status(201).json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'ไม่สามารถสร้างออเดอร์ได้' });
    }
  },
  getLatest: async (req, res) => {
    try {
      const userId = req.user.id;
      const order = await orderService.getLatest(userId);
      if (!order) return res.status(404).json({ message: 'ยังไม่มีออเดอร์' });
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: 'ไม่สามารถโหลดออเดอร์ล่าสุดได้' });
    }
  },
  listMine: async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await orderService.listMine(userId, 20);
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ message: 'ไม่สามารถโหลดประวัติออเดอร์ได้' });
    }
  },
  getById: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const order = await orderService.get(id);
      if (!order || String(order.userId) !== String(userId)) {
        return res.status(404).json({ message: 'ไม่พบออเดอร์' });
      }
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: 'ไม่สามารถโหลดออเดอร์ได้' });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await orderService.updateStatus(id, status);
      if (!updated) return res.status(404).json({ message: 'ไม่พบออเดอร์' });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: 'ไม่สามารถอัปเดตสถานะออเดอร์ได้' });
    }
  }
};

export default ordersController;
