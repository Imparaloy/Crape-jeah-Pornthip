// src/controllers/authController.js
import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

// POST /api/register
export async function apiRegister(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "username, email, password are required" });

    const user = await userService.register({ name: username, email, password, role: "customer" });
    return res.status(201).json({ user });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Register failed" });
  }
}

// POST /api/login
export async function apiLogin(req, res) {
  try {
    const { identifier, password } = req.body; // identifier = username หรือ email
    if (!identifier || !password)
      return res.status(400).json({ message: "identifier and password are required" });

    const user = await userService.login({ identifier, password });
    const token = signToken(user.id);
    return res.json({ token, user });
  } catch (e) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}
