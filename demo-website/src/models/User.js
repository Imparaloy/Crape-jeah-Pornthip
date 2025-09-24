import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String },
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
