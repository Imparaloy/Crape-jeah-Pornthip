import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/router.js';
import menuService from './services/menuService.js';
import Order from './models/Order.js';
import salesRouter from './routes/salesRoutes.js';
import ordersAdminRouter from './routes/ordersAdminRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const dbUrl = process.env.DB_URL;
const connect = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
await connect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const viewsDir = path.join(__dirname, 'views');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs');
app.set('views', viewsDir);
app.use(express.static(publicDir));

app.get('/js/auth.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(publicDir, 'js/auth.js'));
});

// Admin pages (SSR)
app.use('/', ordersAdminRouter);

// Public API endpoints
app.use('/api', router);

app.get('/', async (req, res) => {
  try {
    const [menus, recommendedMenus] = await Promise.all([
      menuService.list(),
      menuService.list({ isRecommended: true })
    ]);
    res.render('index', {
      title: 'Home',
      menus,
      recommendedMenus,
      cart: []
    });
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.render('index', {
      title: 'Home',
      menus: [],
      recommendedMenus: [],
      cart: []
    });
  }
});

app.get('/order', (req, res) => {
  res.render('order', { title: 'Order' });
});

app.use('/sales', salesRouter);

app.get('/customize', (req, res) => {
  res.render('customize', { title: 'Customize' });
});

app.get('/status', (req, res) => {
  res.render('status', { title: 'Status' });
});

app.get(['/profile', '/profile/:userId'], (req, res) => {
  res.render('profile', { title: 'Profile' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
