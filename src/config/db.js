import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.log("DB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;