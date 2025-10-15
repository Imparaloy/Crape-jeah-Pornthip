import express from 'express';
import { getSalesData } from '../services/saleService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await getSalesData();
    res.render('sales', data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching sales data');
  }
});

export default router;