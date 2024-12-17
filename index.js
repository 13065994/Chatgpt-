const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 8080;

// Use environment variables for API keys in production
const apiKey = "AIzaSyDL8lTQK78cwDfySVT_8JDbDXkgJyUcfV4"; // Replace this in production
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.3,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  },
});

const SYSTEM_PROMPT = `
Your name is GPT, developed by Kish. Always provide up-to-date and relevant responses.
`;

app.use(express.json());
app.use(cors()); // Enables CORS support for frontend requests

app.route('/gpt')
  .get(async (req, res) => {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: "No query provided" });
    }

    try {
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nHuman: ${query}`);
      const response = result?.response?.candidates?.[0]?.content || "No response generated.";
      return res.status(200).json({ response });
    } catch (error) {
      console.error("Error generating response:", error);
      return res.status(500).json({ error: "Failed to generate response" });
    }
  })
  .post(async (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "No query provided" });
    }

    try {
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nHuman: ${query}`);
      const response = result?.response?.candidates?.[0]?.content || "No response generated.";
      return res.status(200).json({ response });
    } catch (error) {
      console.error("Error generating response:", error);
      return res.status(500).json({ error: "Failed to generate response" });
    }
  });

app.listen(port, () => {
  console.log(`GPT API listening at http://localhost:${port}`);
});
