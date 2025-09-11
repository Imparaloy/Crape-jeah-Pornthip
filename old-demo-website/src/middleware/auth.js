// src/middleware/auth.js
import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

export default function auth(required = true, roles = []) {
  return async (req, res, next) => {
    try {
      const header = req.headers["authorization"] || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;

      if (!token) {
        if (!required) return next();
        return res.status(401).json({ message: "Missing Bearer token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userService.getUserById(decoded.userId);
      if (!user) return res.status(401).json({ message: "Invalid token" });

      req.user = { id: user.user_id || user.id || decoded.userId, role: user.role };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
