import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("Foundra Backend is Running 🚀");
});

export default app;