import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import sendMail from "../libs/sendMail.js";
import { generateVerificationToken } from "../libs/utils.js";


// Signup Controller
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    // Validate fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Generate email verification token
    const { token, expire } = generateVerificationToken();


    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,

      isVerified: false,
      verificationToken: token,
      verificationTokenExpires: expire,
    });


    await newUser.save();



    // Send verification email
    try {
      console.log("Sending mail to:", newUser.email);
      console.log("Mail sent successfully");
      await sendMail({
        email: newUser.email,
        subject: "Verify your ChatApp Account",

        html: `
        <div style="
          font-family: Arial;
          max-width:600px;
          margin:auto;
          padding:20px;
          border:1px solid #ddd;
          border-radius:10px;
        ">

          <h2>Hello ${firstName} 👋</h2>

          <p>
            Welcome to ChatApp!
          </p>

          <p>
            Please verify your email address by clicking the button below.
          </p>


          <a href="http://localhost:5001/api/auth/verify/${token}"
          style="
          background:#4f46e5;
          color:white;
          padding:12px 20px;
          text-decoration:none;
          border-radius:5px;
          display:inline-block;
          ">
          Verify Email
          </a>


          <p>
          This verification link expires in 24 hours.
          </p>


          <br>

          <p>
          Thanks,<br>
          ChatApp Team
          </p>

        </div>
        `,
      });


    } catch (mailError) {

      console.log("Mail sending failed:", mailError.message);

    }



    return res.status(201).json({

      message:
        "User registered successfully. Please verify your email.",

    });



  } catch (error) {

    console.log("Signup Error:", error.message);

    return res.status(500).json({

      message: error.message,

    });

  }

};




// Email Verification Controller
export const verifyEmail = async (req, res) => {

  try {

    const { token } = req.params;


    const user = await User.findOne({

      verificationToken: token,

      verificationTokenExpires: {
        $gt: Date.now(),
      },

    });



    if (!user) {

      return res.status(400).json({

        message: "Invalid or expired verification link",

      });

    }



    user.isVerified = true;

    user.verificationToken = undefined;

    user.verificationTokenExpires = undefined;


    await user.save();



    return res.status(200).json({

      message: "Email verified successfully",

    });



  } catch (error) {

    console.log("Verification Error:", error.message);


    return res.status(500).json({

      message: "Internal Server Error",

    });

  }

};