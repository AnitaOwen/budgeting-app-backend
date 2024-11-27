const express = require("express");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");
const { findUserByEmail, createUser } = require("../queries/users");

const auth = express.Router();

// Register route
auth.post("/register", async (req, res) => {
    const { password, email, first_name, last_name } = req.body;
    try {
      // Check if user already exists
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
        last_name
      });
  
      const token = generateToken(newUser);
  
      if (token) {
        return res.status(201).json({
          message: "User registered successfully",
          newUser,
          token,
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
    const { email, password } = req.body;
  
    try {
      const user = await findUserByEmail(email);
  
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
      const validPassword = await bcrypt.compare(password, user.password_hash);
  
      if (!validPassword)
        return res.status(401).json({ message: "Invalid credentials" });
  
      const token = generateToken(user);
  
      res.status(200).json({
        message: "Logged in successfully",
        user,
        token,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred during the login process." });
    }
});



module.exports = auth;