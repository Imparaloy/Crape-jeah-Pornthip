const mongoose = require('mongoose');

const SaleDetailSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
});

const SaleSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // วันที่ขาย
  total_sales: { type: Number, required: true },
  today_sales: { type: Number, default: 0 },
  total_orders: { type: Number, required: true },
  total_orders_today: { type: Number, default: 0 },
  bestMenus: [
    {
      name: { type: String, required: true },
      total_price: { type: Number, required: true },
    },
  ],
  bestToppings: [
    {
      name: { type: String, required: true },
      total_price: { type: Number, required: true },
    },
  ],
  details: [SaleDetailSchema],
});

module.exports = mongoose.model('Sale', SaleSchema);