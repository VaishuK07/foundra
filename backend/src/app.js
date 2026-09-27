import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import startupRoutes from "./routes/startupRoutes.js";
import cofounderRoutes from "./routes/cofounderRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

// Middlewares

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use("/api/startups", startupRoutes);

app.use("/api/cofounders", cofounderRoutes);

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