import mongoose from "mongoose";

export  const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    const conn = await mongoose.connect("mongodb://localhost:27017/chat-app");

    console.log(`MongoDB connected successfully!`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};