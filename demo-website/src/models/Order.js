import mongoose from "mongoose";

const OrderToppingSchema = new mongoose.Schema(
  {
    toppingId: { type: mongoose.Schema.Types.ObjectId, ref: "Topping" },
    nameSnap: { type: String, required: true },
    priceSnap: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    nameSnap: { type: String, required: true },
    unitPriceSnap: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    toppings: { type: [OrderToppingSchema], default: [] },
    linePrice: { type: Number, required: true, min: 0 }, // คำนวณรวม
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: { type: [OrderItemSchema], default: [] },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "preparing", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "transfer", "card"],
      default: "cash",
    },
    note: String,
    address: String,
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("Order", OrderSchema);
