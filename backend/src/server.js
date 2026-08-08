import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

console.log("Mongo URI:", process.env.MONGODB_URI);
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});