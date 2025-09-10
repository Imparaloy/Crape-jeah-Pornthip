// src/services/userService.js
import bcrypt from "bcryptjs";
import { createUser, findUserById, findUserByNameOrEmail } from "../models/User.js";

const SALT_ROUNDS = 10;

async function register({ name, email, password, role = "customer" }) {
  const exists = (await findUserByNameOrEmail(name)) || (await findUserByNameOrEmail(email));
  if (exists) throw new Error("Username or email already used");
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ name, email, passwordHash, role });
  return user;
}

async function login({ identifier, password }) {
  const user = await findUserByNameOrEmail(identifier);
  if (!user) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");
  return { id: user.user_id, name: user.name, email: user.email, role: user.role };
}

async function getUserById(id) {
  return await findUserById(id);
}

export default { register, login, getUserById };
