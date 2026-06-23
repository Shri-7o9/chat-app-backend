import express from "express";
import mongoose from "mongoose";
import { connectDB }  from "./libs/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

connectDB().then(() => {

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
})}
)