import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "User name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true  
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // profilePic: {
    //   type: String,
    //   default: "",
    // },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;