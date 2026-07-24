import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

// Render (and most cloud hosts) sit behind a reverse proxy. Without this,
// Express won't recognize the connection as secure (https), which breaks
// "secure: true" cookies in production.
app.set("trust proxy", 1);

// Increased limit to accommodate base64-encoded profile picture uploads
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Comma-separated list of allowed frontend origins, e.g.
// FRONTEND_URL=https://your-frontend.onrender.com,http://localhost:5173
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            // allow requests with no origin (curl, server-to-server, mobile apps)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    })
)

// Simple health check endpoint, useful for Render's health checks and uptime monitors
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/auth",authRoute);
app.use("/api/messages", messageRoutes);


connectDB().then(() => {
  const PORT = process.env.PORT || 5001;

  // Render assigns its own PORT via env var and expects the app to bind to it,
  // and to 0.0.0.0 rather than just localhost.
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
});