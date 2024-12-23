import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { sendMessage , getMessages } from "../controllers/messageController.js"


const router = Router();

router.route('/send/:id').post(verifyToken, sendMessage);
router.route('/getMessages/:id').get(verifyToken, getMessages);

export default router;