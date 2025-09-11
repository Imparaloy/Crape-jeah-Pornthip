// src/models/User.js
import { pool } from "../config/db.js";

export async function createUser({ name, email, passwordHash, role = "customer" }) {
  const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  const [result] = await pool.execute(sql, [name, email, passwordHash, role]);
  return { user_id: result.insertId, name, email, role };
}

export async function findUserByNameOrEmail(identifier) {
  const sql = `
    SELECT user_id, name, email, password, role
    FROM users
    WHERE name = ? OR email = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(sql, [identifier, identifier]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const sql = `SELECT user_id, name, email, password, role FROM users WHERE user_id = ? LIMIT 1`;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0] || null;
}
