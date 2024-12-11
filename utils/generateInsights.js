require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = process.env.API_KEY

const generateInsights = async (transactions) => {

    const genAI = new GoogleGenerativeAI(key);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a friendly and empathetic financial assistant for a budgeting app. Your task is to analyze the provided user transaction data and deliver actionable insights and personalized suggestions. 

    - Include calculated examples and offer real examples based on the data to show specific ways the user can improve their budget. Consider current general market trends.
    - Highlight both positive trends and areas for improvement in a balanced, encouraging tone.
    - Based on the budget and disposable income, suggest a percentage or amount that the user could set aside monthly for investments.
    - Avoid generic advice; focus on deeper, meaningful insights that directly address the user's data.
    - Provide suggestions that are uplifting, relatable, and practical, and encourage the user to add more transactions to unlock further insights.
    - Give me at least 10 strings.

    Output the results as a JSON string containing an array of insights and suggestions. Each element in the array should be a string, where each sentence of an insight or suggestion is separated by a line break. Return only the JSON array, with no additional text before or after it.

    User's Transaction Data: ${JSON.stringify(transactions)}
    `;

    const result = await model.generateContent(prompt);
    
    const responseString = result.response.text()

    return responseString.slice(7, -4).trim()

    
}

module.exports = {generateInsights};

