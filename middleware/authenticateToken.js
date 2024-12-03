const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; 
    console.log("middleware token", token)
  
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
      }
      console.log("token user", user)
      req.user = user;
      next(); 
    });
}

module.exports = authenticateToken;
