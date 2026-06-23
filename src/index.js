import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});

app.listen(5001,() => {
    console.log("Server started on PORT: 5001");
    
} )