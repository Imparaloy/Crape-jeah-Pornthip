import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connect } from "./db.js";

dotenv.config();

const port = process.env.PORT || 3000;

try {
  await connect(process.env.DB_URL);
  console.log("Connected to MongoDB successfully");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
}

const app = await createApp();

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
