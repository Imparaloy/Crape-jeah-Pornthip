import dotenv from "dotenv";
import mongoose from "mongoose";
import Menu from "../models/menu.js";
import Order from "../models/Order.js";

dotenv.config();

async function main() {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    console.error("DB_URL is not set in environment");
    process.exit(1);
  }
  await mongoose.connect(dbUrl);

  const cursor = Order.find({
    $or: [
      { "items.nameSnap": { $exists: false } },
      { "items.nameSnap": { $in: ["เมนูพิเศษ", "เมนู", null, ""] } },
    ],
  }).cursor();

  let updated = 0;
  for await (const order of cursor) {
    let changed = false;
    for (const it of order.items) {
      const isPlaceholder =
        !it.nameSnap || it.nameSnap === "เมนูพิเศษ" || it.nameSnap === "เมนู";
      if (!isPlaceholder) continue;
      if (it.productId) {
        const menu = await Menu.findById(it.productId, "name");
        if (menu && menu.name) {
          it.nameSnap = menu.name;
          changed = true;
        }
      }
    }
    if (changed) {
      await order.save();
      updated += 1;
      console.log(`Updated order ${order._id}`);
    }
  }

  console.log(`Done. Updated ${updated} orders.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
