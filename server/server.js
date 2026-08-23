import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom DNS to ensure reliable Atlas connection on Windows / cloud environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.log("DNS custom config notice:", e.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

// User MongoDB Atlas Connection String
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://avinash00000724_db_user:5BzvPmDhyvuCn8rP@cluster0.wqwxtvi.mongodb.net/bhumi_setu?retryWrites=true&w=majority";

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/assessments", assessmentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "BHOOMI-SETU Authentication & Assessment Sync Service",
    database: mongoose.connection.readyState === 1 ? "Connected to MongoDB Atlas" : "Connecting/Offline",
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend assets in production
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Fallback for SPA Client-Side Routing (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        res.status(200).send("BHOOMI-SETU API Server is running. Run 'npm run build' to generate frontend production assets.");
      }
    });
  }
  next();
});

// Connect to MongoDB Atlas
console.log("Connecting to MongoDB Atlas...");
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Atlas (Database: bhumi_setu)");
  })
  .catch((err) => {
    console.error("⚠️ MongoDB Atlas connection error:", err.message);
  });

app.listen(PORT, () => {
  console.log(`🚀 BHOOMI-SETU Backend running on http://localhost:${PORT}`);
});

