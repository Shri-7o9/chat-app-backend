import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
)

app.use("/api/auth",authRoute);
app.use("/api/messages", messageRoutes);


connectDB().then(() => {
  const PORT = process.env.PORT || 5001;

  app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
});