import User from "../models/User.js";

const getAllUsers = () => User.find();
const getUserById = (id) => User.findById(id);
const getByUsername = (name) => User.findOne({ name });
const create = ({ name, password, age, phone }) =>
  User.create({ name, password, age, phone });

export default {
  getAllUsers,
  getUserById,
  getByUsername,
  create,
};
