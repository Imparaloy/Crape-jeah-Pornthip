import authMiddleware from "../middlewares/authMiddleware.js";
import ordersController from "../controllers/ordersController.js";

const useOrdersRoute = async (router) => {
  router.post("/orders", authMiddleware(), ordersController.createFromMyCart);
  router.get("/orders/latest", authMiddleware(), ordersController.getLatest);
  router.get("/orders/:id", authMiddleware(), ordersController.getById);
  router.get("/orders", authMiddleware(), ordersController.listMine);
  router.put(
    "/orders/:id/status",
    authMiddleware("seller"),
    ordersController.updateStatus,
  );
};

export default useOrdersRoute;
