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
import connectionRoutes from "./routes/connectionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

// Global Middlewares

app.use(cors());

app.use(
    express.json({
        limit: "10kb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10kb"
    })
);


// API Routes

app.use("/api/auth", authRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/cofounders", cofounderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Health Check

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Foundra Backend is Running 🚀"
    });
});


// Protected Test Route

app.get(
    "/api/protected",
    authMiddleware,
    (req, res) => {
        res.status(200).json({
            message: "You have access to protected route",
            user: req.user
        });
    }
);


// 404 - Route Not Found

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// Global Error Handler

app.use((err, req, res, next) => {
    console.error("Global Error:", err);

    res.status(err.status || 500).json({
        message:
            err.status && err.status < 500
                ? err.message
                : "Internal server error"
    });
});


export default app;