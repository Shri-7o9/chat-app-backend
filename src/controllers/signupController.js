import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import sendMail from "../libs/sendMail.js";
import { generateSignupToken, verifySignupToken } from "../libs/utils.js";


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


    // Encode the signup data itself into a signed, expiring token.
    // IMPORTANT: no User document is created here. Nothing is saved to
    // the database until the user actually clicks the verification link,
    // so an unverified signup never persists as isVerified: false.
    const token = generateSignupToken({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });


    // Send verification email
    try {
      console.log("Sending mail to:", email);
      await sendMail({
        email,
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
// This is the ONLY place a User document gets created for a new signup.
// If the token is invalid/expired, or the user never clicks the link,
// nothing was ever written to the database.
export const verifyEmail = async (req, res) => {

  try {

    const { token } = req.params;

    let decoded;

    try {
      decoded = verifySignupToken(token);
    } catch (err) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }

    const { firstName, lastName, userName, email, password } = decoded;

    // Guard against the link being clicked twice, or a second signup
    // completing verification for an email that already exists.
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    // Only now — after verification — do we save anything to the DB,
    // and we save it already verified.
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password,
      isVerified: true,
    });

    await newUser.save();

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