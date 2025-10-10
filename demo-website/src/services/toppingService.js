import Topping from '../models/Topping.js';

export default {
  list: () => Topping.find().sort({ name: 1 }),
  get:  (id) => Topping.findById(id),
  create: (payload) => Topping.create(payload),
  update: (id, payload) => Topping.findByIdAndUpdate(id, payload, { new: true }),
  remove: (id) => Topping.findByIdAndDelete(id),
};