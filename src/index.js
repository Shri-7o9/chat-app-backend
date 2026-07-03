import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoute);
app.use("/api/messages", messageRoutes);


app.listen(process.env.PORT, () => {
    connectDB();
  console.log(`Server running on port ${process.env.PORT}`);
});