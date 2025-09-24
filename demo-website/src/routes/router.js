import express from 'express';
import useUserRoute from './userRoutes.js';
import useMenuRoute from './menuRoutes.js';
import useCartRoute from './cartRoutes.js';

const router = express.Router();

await useUserRoute(router);
await useMenuRoute(router);
await useCartRoute(router);

export default router;
