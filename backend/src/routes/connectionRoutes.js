import express from "express";
import connectionController from "../controllers/connectionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    connectionController.sendRequest
);

router.get(
    "/",
    authMiddleware,
    connectionController.getRequests
);

router.get(
    "/accepted",
    authMiddleware,
    connectionController.getAcceptedConnections
);

router.put(
    "/:connectionId",
    authMiddleware,
    connectionController.updateRequestStatus
);

export default router;