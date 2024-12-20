import { Router } from "express";
import { register, login, getUser } from "../controllers/authController.js"
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getUser', verifyToken, getUser);

export default router;