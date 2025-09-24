import User from '../models/User.js';

const userService = {
  getAllUsers: async () => User.find(),
  getUserById: async (id) => User.findById(id),
  getByUsername: async (name) => User.findOne({ name }),
  create: async (name, password, age, phone, role = 'user') => {
    return User.create({ name, password, age, phone, role });
  }
};

export default userService;
