import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

const sanitizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role || 'customer',
    isActive: user.isActive ?? true,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users.map(sanitizeUser));
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  },
  getUserById: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(sanitizeUser(user));
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  },
  register: async (req, res) => {
    try {
      const { name, password, phone, role } = req.body;
      if (!name || !password) {
        return res.status(400).json({ message: "Name and password are required" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userService.create({
        name,
        password: hashedPassword,
        phone,
        role,
      });
      res.status(201).json({ user: sanitizeUser(user) });
    } catch (err) {
      console.log(err);
      if (err && err.code === 11000) {
        return res.status(409).json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
      }
      res.status(500).json({ message: "Failed to register", error: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { name, password } = req.body;
      if (!name || !password) {
        return res.status(400).json({ message: "Name and password are required" });
      }
      const user = await userService.getByUsername(name);
      if (!user) {
        return res.status(401).json({
          message: "Username or Password incorrect",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Username or Password incorrect",
        });
      }
      const jwt_secret = process.env.JWT_SECRET;
      const payload = { name: user.name, userId: user.id, role: user.role };
      const token = jwt.sign(payload, jwt_secret, { expiresIn: "3d" });
      res.status(200).json({
        token,
        user: sanitizeUser(user),
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to login" });
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = await userService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user: sanitizeUser(user) });
    } catch (err) {
      res.status(500).json({ message: "Failed to load profile" });
    }
  },
};

export default userController;
