import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/:userId",
    authMiddleware,
    userController.getUserProfile
);

export default router;