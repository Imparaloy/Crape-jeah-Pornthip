import Menu from "../models/Menu.js";

export default {
  list: (filter = {}, options = {}) => Menu.find(filter, null, options),
  get: (id) => Menu.findById(id),
  create: (payload) => Menu.create(payload),
  update: (id, payload) => Menu.findByIdAndUpdate(id, payload, { new: true }),
  remove: (id) => Menu.findByIdAndDelete(id),
};
