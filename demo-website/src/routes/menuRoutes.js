import authMiddleware from '../middlewares/authMiddleware.js';
import menuController from '../controllers/menuController.js';

const useMenuRoute = async (router) => {
  // public list / get
  router.get('/menus', menuController.list);
  router.get('/menus/:id', menuController.get);

  // seller can manage menu
  router.post('/menus', authMiddleware('seller'), menuController.create);
  router.put('/menus/:id', authMiddleware('seller'), menuController.update);
  router.delete('/menus/:id', authMiddleware('seller'), menuController.remove);

  // example: recommended list (เหมือนของเดิม)
  router.get('/menus-recommended', async (req, res) => {
    req.query.recommended = 'true';
    return menuController.list(req, res);
  });
};

export default useMenuRoute;
