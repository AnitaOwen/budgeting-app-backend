const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    id: user.id, // Use user's unique identifier
    email: user.email,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "1h", // Token expires in 1 hour
  };

  return jwt.sign(payload, secret, options);
}

module.exports = { generateToken };