import Menu from '../models/menu.js';

const menuService = {
  list: async (filter = {}, options = {}) => Menu.find(filter, null, options),
  getById: async (id) => Menu.findById(id),
  create: async (payload) => Menu.create(payload),
  update: async (id, payload) => Menu.findByIdAndUpdate(id, payload, { new: true }),
  remove: async (id) => Menu.findByIdAndDelete(id),
};

export default menuService;
