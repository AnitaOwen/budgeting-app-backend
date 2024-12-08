require("dotenv").config();
const express = require("express");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = express.Router();

ai.post("/api/ai", async (req, res) => {
    const { transactions } = req.body;
  
    if (!transactions || !transactions.length) {
      return res.status(400).json({ error: "No transactions provided" });
    }
  
    try {
      const input = `Analyze these transactions and provide insights and suggestions: ${JSON.stringify(
        transactions
      )}`;

      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const response = await model.generateText({
      prompt: input,
      maxOutputTokens: 150,
      temperature: 0.7,
    });
    
      // Extract generated text
      const insights = response.generatedText.split("\n").filter((line) => line.trim());
      res.json({ insights });
    } catch (error) {
      console.error("Error generating AI insights:", error);
      res.status(500).json({ error: "Failed to generate AI insights" });
    }
  });

  module.exports = ai;  