import { Router } from "express";
import { getAllConversations } from "../controllers/conversationsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = Router();

router.route('/getAllConversations').get(verifyToken, getAllConversations);

export default router;