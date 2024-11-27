const express = require("express");
const cors = require("cors");

// CONFIGURATION
const app = express();

// MIDDLEWARE
app.use(
    cors({
      origin: "http://localhost:3000",
    //   origin: ["https://main--fridgem8.netlify.app", "http://localhost:3000"]
    })
);

app.use(express.json());


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