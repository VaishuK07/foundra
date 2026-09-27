import express from "express";
import startupController from "../controllers/startupController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, startupController.createStartup);
router.get("/my", authMiddleware, startupController.getMyStartup);
router.put("/my", authMiddleware, startupController.updateMyStartup);
router.delete("/my", authMiddleware, startupController.deleteMyStartup);

export default router;