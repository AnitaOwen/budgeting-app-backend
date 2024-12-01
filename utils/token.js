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

  return jwt.sign(payload, secret, options);
}

module.exports = { generateToken };