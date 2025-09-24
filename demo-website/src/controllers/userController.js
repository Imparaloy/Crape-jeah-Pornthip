import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';

const userController = {
  // GET /api/users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  },

  // GET /api/users/:id
  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  },

  // POST /api/register
  register: async (req, res) => {
    try {
      const { name, password, age, phone, role } = req.body;
      if (!name || !password || !age) {
        return res.status(400).json({ message: 'name, password, age are required' });
      }
      const existed = await userService.getByUsername(name);
      if (existed) return res.status(409).json({ message: 'Username already exists' });

      const hashed = await bcrypt.hash(password, 10);
      const user = await userService.create(name, hashed, age, phone, role || 'user');
      res.status(201).json({ id: user.id, name: user.name, role: user.role });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  },

  // POST /api/login
  login: async (req, res) => {
    try {
      const { name, password } = req.body;
      const user = await userService.getByUsername(name);
      if (!user) return res.status(401).json({ message: 'Username or Password incorrect' });

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) return res.status(401).json({ message: 'Username or Password incorrect' });

      const payload = { name: user.name, userId: user.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: String(err) });
    }
  }
};

export default userController;
