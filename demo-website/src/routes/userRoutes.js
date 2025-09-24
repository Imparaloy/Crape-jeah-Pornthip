import authMiddleware from "../middlewares/authMiddleware.js"
import userController from "../controllers/userController.js"

const useUserRoute = async (router) => {
  router.get('/user', authMiddleware("admin"), userController.getAllUsers)
  router.get('/user/:id', userController.getUserById)
  router.post('/register', userController.register)
  router.post('/login', userController.login)
}

export default useUserRoute