const express = require('express');
const path = require('path');
require('dotenv').config();

// Import routes
const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Note: DB connection is initialized in server.js before app.listen

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Use routes
app.use('/', menuRoutes);
app.use('/', cartRoutes);

// Global error handler (must be after routes)
app.use(errorHandler);

module.exports = app;
