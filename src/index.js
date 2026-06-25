import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { connectDB }  from "./libs/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

connectDB().then(() => {
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
})}
)

