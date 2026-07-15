import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
      unique:true,
    },

    userName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Email verification
    verificationToken: {
      type: String,
    },

    verificationTokenExpires: {
      type: Date,
    },

    // Password reset
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
//added new lines for profile picture and cloudinary ID
    profilePic: {
  type: String,
  default: "",
},
cloudinaryId: {
  type: String,
  default: "",
},

  },
  {
    timestamps: true,
  }
);


// Password compare method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;