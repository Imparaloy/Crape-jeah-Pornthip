import express from 'express';
import { listOrdersAdmin, updateOrderStatusAdmin } from '../controllers/ordersAdminController.js';

const r = express.Router();
r.get('/orders', listOrdersAdmin);
r.put('/orders/:id/status', updateOrderStatusAdmin);
export default r;
