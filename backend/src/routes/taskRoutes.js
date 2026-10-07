import express from "express";
import taskController from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, taskController.createTask);

router.get("/", authMiddleware, taskController.getMyTasks);

router.put("/:taskId", authMiddleware, taskController.updateTask);

router.delete("/:taskId", authMiddleware, taskController.deleteTask);

export default router;