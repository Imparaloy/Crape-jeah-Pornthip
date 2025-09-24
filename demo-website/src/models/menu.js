import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    sku: String,
    name: { type: String, required: true, trim: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    imageUrl: String,
    isRecommended: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

MenuSchema.index({ name: "text" });
export default mongoose.model("Menu", MenuSchema);
