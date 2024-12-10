require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = process.env.API_KEY

const generateInsights = async (transactions) => {

    const genAI = new GoogleGenerativeAI(key);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a friendly financial assistant AI for a budgeting app. Your goal is to analyze a user's transaction data and provide actionable insights and personalized suggestions in an encouraging and empathetic tone. Give real examples using the data provided to give caculated actionable examples of how the user can improve their budget or specific steps they can take regarding ways or areas where they can invest. Be relatable and keep the advice uplifting. Return the results as an array of strings in JSON string format, where each string is either an insight or a suggestion. Return the array only. Separate each sentence of an insight with a line break. No other words are wanted before or after the valid json.
    User's Transaction Data: ${JSON.stringify(transactions)}
    `;

    const result = await model.generateContent(prompt);
    
    const responseString = result.response.text()

    return responseString.slice(7, -4).trim()

    
}

module.exports = {generateInsights};

