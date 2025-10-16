import express from 'express';
import useUserRoute from './userRoutes.js';
import useMenuRoute from './menuRoutes.js';
import useCartRoute from './cartRoutes.js';
import useOrdersRoute from './ordersRoutes.js';
import useOrdersAdminRoutes from './ordersAdminRoutes.js';

const router = express.Router();

await useUserRoute(router);
await useMenuRoute(router);
await useCartRoute(router);
await useOrdersRoute(router);
await useOrdersAdminRoutes(router);
export default router;
