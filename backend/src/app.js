import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

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