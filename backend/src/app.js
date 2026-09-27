import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import startupRoutes from "./routes/startupRoutes.js";
import cofounderRoutes from "./routes/cofounderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/cofounders", cofounderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Foundra Backend is Running 🚀");
});

// Protected Route
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You have access to protected route",
        user: req.user
    });
});

export default app;