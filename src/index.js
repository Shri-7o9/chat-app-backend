import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();


app.use(express.json());

app.use("/api/auth",authRoute);


app.listen(process.env.PORT, () => {
    connectDB();
  console.log(`Server running on port ${process.env.PORT}`);
});