import mongoose from "mongoose";
const CartCustomOptionSchema = new mongoose.Schema(
  {
    group: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
  },
  { _id: false },
);

const CartItemSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
    qty: { type: Number, default: 1, min: 1 },
    note: String,
    custom: {
      name: String,
      basePrice: Number,
      options: { type: [CartCustomOptionSchema], default: [] },
      totalPrice: Number,
    },
  },
  { _id: true },
);
const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);
export default mongoose.model("Cart", CartSchema);
