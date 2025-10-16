import mongoose from "mongoose";
const ToppingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);
export default mongoose.model("Topping", ToppingSchema);
