import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT,() => {
    console.log(`Server started on PORT: ${PORT}`);
} )