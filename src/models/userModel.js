import mongoose from "mongoose";

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

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

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


const User = mongoose.model("User", userSchema);


export default User;