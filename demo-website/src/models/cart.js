import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  qty: { type: Number, default: 1, min: 1 },
  note: String
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  items: { type: [CartItemSchema], default: [] }
}, { timestamps: true });

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
