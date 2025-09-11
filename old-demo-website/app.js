import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import { pool } from "./src/config/db.js";
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api", authRoutes);

// เชื่อมต่อ DB 
async function startServer() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`Website running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

startServer();
