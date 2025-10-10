import User from "../models/User.js";

const getAllUsers = () => User.find();
const getUserById = (id) => User.findById(id);
const getByUsername = (name) => User.findOne({ name });
const create = ({ name, password, phone, role }) => {
  const payload = { name, password };
  if (phone) payload.phone = phone;
  const allowedRoles = ['customer', 'seller', 'admin'];
  if (role && allowedRoles.includes(role)) {
    payload.role = role;
  }
  return User.create(payload);
};

export default {
  getAllUsers,
  getUserById,
  getByUsername,
  create,
};
