import authMiddleware from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";

const useUserRoute = async (router) => {
  router.get("/user", authMiddleware("admin"), userController.getAllUsers);
  router.get("/user/:id", authMiddleware(), userController.getUserById);
  router.get("/me", authMiddleware(), userController.getProfile);
  router.post("/register", userController.register);
  router.post("/login", userController.login);
  router.post("/logout", userController.logout);
};

export default useUserRoute;
