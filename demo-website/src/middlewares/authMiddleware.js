import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';

const authMiddleware = (requiredRole = undefined) => {
  return async (req, res, next) => {
    try {
      const auth = req.headers['authorization'] || '';
      const parts = auth.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const token = parts[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userService.getUserById(decoded.userId);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });

      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = { id: user.id, role: user.role, name: user.name };
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

export default authMiddleware;
