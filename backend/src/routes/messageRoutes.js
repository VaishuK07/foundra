import express from "express";
import messageController from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, messageController.sendMessage);

router.get(
    "/:userId",
    authMiddleware,
    messageController.getConversation
);

export default router;