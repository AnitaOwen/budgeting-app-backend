require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/token");
const { findUserByEmail, createUser, updateUserVerification, verifyOtp, saveOtpForUser, updateUserPassword } = require("../queries/users");
const { sendVerificationEmail, sendOtpEmail } = require("../utils/email")
const { generateOtp } = require("../utils/otp")

const auth = express.Router();

// Register route
auth.post("/register", async (req, res) => {
  const { password, email, first_name, last_name } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "There is already an account with this email" });
    }
  
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create user in the database
    const newUser = await createUser({
      passwordHash: hashedPassword,
      email,
      first_name, 
      last_name,
      is_verified: false, 
    });

    const verificationToken = generateToken(newUser, "email_verification");

    await sendVerificationEmail(email, verificationToken);
  
    if (verificationToken) {
      return res.status(201).json({
        message: "Registration success! Please verify your email.",
        user: newUser,
        token: verificationToken,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred during the registration process." });
  }
});

// Login route
auth.post("/login", async (req, res) => {
  const { email, password, otp } = req.body;
  
  try {
    const foundUser = await findUserByEmail(email);
  
    if (!foundUser){
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const validPassword = await bcrypt.compare(password, foundUser.password_hash);
  
    if (!validPassword){
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!foundUser.is_verified) {
      return res.status(400).json({ message: "Email not verified. Please verify your email first." });
    }

    if(!otp){
      const generatedOtp = generateOtp();
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000); 
      await saveOtpForUser(foundUser.id, generatedOtp, expirationTime);
      await sendOtpEmail(foundUser.email, foundUser.id, generatedOtp); 
      return res.status(200).json({
        message: "OTP sent to your email. Please check your inbox.",
      });
    }
    
    const isOtpValid = await verifyOtp(foundUser.id, otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
     
    const token = generateToken(foundUser);
  
    res.status(200).json({
      message: "Logged in successfully",
      user: foundUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred during the login process." });
  }
});

// verify email route
auth.post("/verify-email/:token", async (req, res) => {

  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "email_verification") {
      return res.status(400).json({ message: "Invalid token purpose" });
    }
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await updateUserVerification({ id: user.id, is_verified: true });

    const newToken = generateToken(updatedUser)

    res.status(200).json({
      message: "Email verified successfully! ",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        is_verified: updatedUser.is_verified,
      },
      token: newToken
    });
  } catch(error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

auth.put("/update-password", async (req, res) => {
  const { id, email, newPassword, oldPassword } = req.body
  try {

    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const oldHashedPassword = await bcrypt.hash(oldPassword, saltRounds);

    const foundUser = await findUserByEmail(email);
    if(foundUser.password_hash && foundUser.email){
      if(foundUser.password_hash === oldHashedPassword){
        const updatedUser = await updateUserPassword(id,newHashedPassword);

        if(updatedUser.id){
          res.status(200).json({
            message: "password updated successfully",
            user: updatedUser,
          });
        }

        
      }
    } 
  } catch(error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update password" });
  }



})

module.exports = auth;