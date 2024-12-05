const express = require("express");
const cors = require("cors");
const authController = require("./controllers/authController");
const transactionsController = require("./controllers/transactionsController");
// const authenticateToken = require("./middleware/authenticateToken");

// CONFIGURATION
const app = express();

// MIDDLEWARE
app.use(
    cors({
      origin: ["https://clinquant-rolypoly-ea3737.netlify.app", "http://localhost:3000"],
      // origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
      allowedHeaders: ["Content-Type", "Authorization"], 
      credentials: true,
    //   origin: ["", "http://localhost:3000"]
    })
);
app.options('*', cors());

app.use(express.json());

app.use("/api/auth", authController);
app.use("/api/transactions", transactionsController)

// ROUTES
app.get("/", (_req, res) => {
    res.send("Budgeting And Investment Recommendations App");
  });
  
  // 404 PAGE
  app.get("*", (_req, res) => {
    res.status(404).send("Page not found");
  });
  
  // EXPORT
  module.exports = app;