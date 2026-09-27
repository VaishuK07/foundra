import express from "express";
import cofounderController from "../controllers/cofounderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, cofounderController.findCoFounders);

export default router;