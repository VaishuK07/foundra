import express from "express";
import analyticsController from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    analyticsController.getAnalytics
);

router.put(
    "/",
    authMiddleware,
    analyticsController.updateAnalytics
);

router.post(
    "/profile-view",
    authMiddleware,
    analyticsController.recordProfileView
);

export default router;