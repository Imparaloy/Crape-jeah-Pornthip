const express = require('express');
const path = require('path');
const Menu = require('./models/menu');
const Cart = require('./models/cart');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  try {
    const menus = await Menu.find({ isAvailable: true });
    const recommendedMenus = await Menu.find({ isRecommended: true, isAvailable: true });
    
    // For now, we'll use a temporary user ID for the cart
    const tempUserId = 'temp-user-1';
    const cart = await Cart.findOne({ userId: tempUserId }).populate('items.menu');

    res.render('index', {
      menus,
      recommendedMenus,
      cart: cart ? cart.items : []
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('error', { message: 'Server error' });
  }
});

module.exports = app;
