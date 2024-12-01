const jwt = require("jsonwebtoken");

function generateToken(user, purpose = "access") {
  const payload = {
    id: user.id,
    email: user.email,
    purpose,
  };

  const secret = process.env.JWT_SECRET;
  
  const options = {
    expiresIn: purpose === "email_verification" ? "1h" : "1d", 
  };

  try {
    return jwt.sign(payload, secret, options);
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate token.");
  }
}

module.exports = { generateToken };