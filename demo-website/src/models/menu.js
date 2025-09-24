import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  imageUrl: String,
  isRecommended: { type: Boolean, default: false },
  available: { type: Boolean, default: true }
}, { timestamps: true });

const Menu = mongoose.model('Menu', MenuSchema);
export default Menu;
