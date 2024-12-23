import { Router } from "express";
import { register, login, getUser, getOtherUsers } from "../controllers/authController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getUser', verifyToken, getUser);
router.get('/getUsers', verifyToken, getOtherUsers);

export default router;