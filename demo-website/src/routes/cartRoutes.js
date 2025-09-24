import authMiddleware from '../middlewares/authMiddleware.js';
import cartController from '../controllers/cartController.js';

const useCartRoute = async (router) => {
  router.get('/cart', authMiddleware(), cartController.getMine);
  router.post('/cart/items', authMiddleware(), cartController.addItem);
  router.post('/cart/custom', authMiddleware(), cartController.addCustomItem);
  router.put('/cart/items/:itemMenuId', authMiddleware(), cartController.updateItem);
  router.delete('/cart/items/:itemMenuId', authMiddleware(), cartController.removeItem);
  router.post('/cart/clear', authMiddleware(), cartController.clear);
};

export default useCartRoute;
