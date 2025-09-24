import menuService from '../services/menuService.js';

const menuController = {
  list: async (req, res) => {
    try {
      const { q, min, max, page = 1, limit = 12, recommended } = req.query;
      const filter = {};
      if (q) filter.name = { $regex: q, $options: 'i' };
      if (recommended === 'true') filter.isRecommended = true;
      if (min || max) filter.price = {
        ...(min ? { $gte: Number(min) } : {}),
        ...(max ? { $lte: Number(max) } : {})
      };

      const skip = (Number(page) - 1) * Number(limit);
      const items = await menuService.list(filter, { skip, limit: Number(limit) });
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  },
  get: async (req, res) => {
    try {
      const item = await menuService.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  },
  create: async (req, res) => {
    try {
      const created = await menuService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  },
  update: async (req, res) => {
    try {
      const updated = await menuService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  },
  remove: async (req, res) => {
    try {
      const removed = await menuService.remove(req.params.id);
      if (!removed) return res.status(404).json({ message: 'Not found' });
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  }
};

export default menuController;
