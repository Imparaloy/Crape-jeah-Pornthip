import Category from "../models/Category.js";

export default {
  list: () => Category.find().sort({ name: 1 }),
  get: (id) => Category.findById(id),
  create: (payload) => Category.create(payload),
  update: (id, payload) =>
    Category.findByIdAndUpdate(id, payload, { new: true }),
  remove: (id) => Category.findByIdAndDelete(id),
};
