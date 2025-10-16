import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/router.js';
import menuService from './services/menuService.js';
import ordersAdminRouter from './routes/ordersAdminRoutes.js';
import pageAuth from './middlewares/pageAuth.js';
import cookieParser from 'cookie-parser';
import salesRouter from './routes/salesRoutes.js';

dotenv.config();

export async function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

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

  app.get('/orders', pageAuth(['seller', 'admin']), (req, res, next) => ordersAdminRouter.handle(req, res, next));
  app.put('/orders/:id/status', pageAuth(['seller', 'admin']), (req, res, next) => ordersAdminRouter.handle(req, res, next));

  app.use('/api', router);

  try {
    const swaggerUi = (await import('swagger-ui-express')).default;
    const openapi = (await import('./docs/openapi.js')).default;
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));
    app.get('/api/openapi.json', (req, res) => res.json(openapi));
  } catch (error) {
    // Swagger is optional during tests
  }

  app.get('/', async (req, res) => {
    try {
      const [menus, recommendedMenus] = await Promise.all([
        menuService.list(),
        menuService.list({ isRecommended: true })
      ]);
      res.render('index', { title: 'Home', menus, recommendedMenus, cart: [] });
    } catch (err) {
      res.render('index', { title: 'Home', menus: [], recommendedMenus: [], cart: [] });
    }
  });

  app.get('/order', (req, res) => res.render('order', { title: 'Order' }));
  app.use('/sales', salesRouter);
  app.get('/customize', (req, res) => res.render('customize', { title: 'Customize' }));
  app.get('/status', (req, res) => res.render('status', { title: 'Status' }));
  app.get(['/profile', '/profile/:userId'], (req, res) => res.render('profile', { title: 'Profile' }));
  app.get('/login', (req, res) => res.render('login', { title: 'Login' }));
  app.get('/register', (req, res) => res.render('register', { title: 'Register' }));

  return app;
}
