// src/routes/authRoutes.js
import { Router } from "express";
import { apiLogin, apiRegister } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = Router();


/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing or invalid input
 */
router.post("/register", apiRegister);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username or email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", apiLogin);


/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current user info (requires Bearer token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns userId and role
 *       401:
 *         description: Unauthorized
 */
router.get("/me", auth(true), (req, res) => {
  res.json({ userId: req.user.id, role: req.user.role });
});


/**
 * @swagger
 * /api/admin-only:
 *   get:
 *     summary: Admin-only endpoint (requires Bearer token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns ok and message for admin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/admin-only", auth(true, ["admin"]), (req, res) => {
  res.json({ ok: true, message: "Hello admin!" });
});

export default router;
