require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/token");
const { findUserByEmail, createUser, updateUserVerification, verifyOtp, saveOtpForUser, updateUserPassword, findUserById } = require("../queries/users");
const { sendVerificationEmail, sendOtpEmail, sendPasswordChangeEmail, sendTempPasswordEmail } = require("../utils/email")
const { generateOtp } = require("../utils/otp")

const auth = express.Router();

// Register route
auth.post("/register", async (req, res) => {
  const { password, email, first_name, last_name } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser !== null) {
      return res.status(401).json({ message: "There is already an account with this email" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
        message: "Registration success! Please check your inbox to verify your email before logging in.",
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

auth.post("/login/demo-user", async (req, res) => {
  const email = "aveniia@gmail.com"
  try {
    const foundUser = await findUserByEmail(email);
    const token = generateToken(foundUser);
    res.status(200).json({
      message: "Logged in successfully",
      user: foundUser,
      token,
    });
  } catch(error){
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred during the login process." });
  }
})

// Login route
auth.post("/login", async (req, res) => {
  const { email, password, otp } = req.body;
  
  try {
    const foundUser = await findUserByEmail(email);
  
    if (!foundUser){
      return res.status(401).json({ message: `There is no account registered with this email`});
    }
  
    const validPassword = await bcrypt.compare(password, foundUser.password_hash);
  
    if (!validPassword){
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    if (!foundUser.is_verified) {
      return res.status(400).json({ message: "Please check your email or spam inbox for a link to verify your email first" });
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
      return res.status(400).json({ message: "Invalid or expired OTP. Please try again." });
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

auth.put("/update-password/:id", async (req, res) => {
  const { newPassword, currentPassword } = req.body;
  const { id } = req.params;
  // console.log('PUT Request body:', req.body); 
  // console.log('PUT params ID:', id); 

  if (!newPassword || !currentPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required." });
  }
  try {

    const foundUser = await findUserById(id);

    if (!foundUser || !foundUser.password_hash) {
      return res.status(404).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(currentPassword, foundUser.password_hash);
    console.log("current password isMatch", isMatch)

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await updateUserPassword(foundUser.id, newHashedPassword);

    if (updatedUser.id) {
      console.log("Password updated successfully for user:", updatedUser);
      await sendPasswordChangeEmail(updatedUser);
      res.status(200).json({
        message: "Password updated successfully",
        user: updatedUser,
      });
    }
  } catch(error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update password" });
  }

})

auth.put("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const foundUser = await findUserByEmail(email);

    if (!foundUser){
      return res.status(401).json({ message: `No account found for the email ${email}` });
    }
    
    const temporaryPass = Math.random().toString(36).slice(-8);
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(temporaryPass, saltRounds);

    const updatedUser = await updateUserPassword(foundUser.id, newHashedPassword);

    if (!updatedUser) {

      return res.status(500).json({ message: "Password update failed. Please try again." });
    }

    await sendTempPasswordEmail(updatedUser.email, temporaryPass);

    res.status(200).json({
      message: `A temporary password has been sent to ${email}. Please use it to log in and change your password.`
    });
  } catch(error){
    console.error("Error in forgot-password:", error.message);
    res.status(500).json({ message: "Failed to process forgot password request." });
  }
})

module.exports = auth;