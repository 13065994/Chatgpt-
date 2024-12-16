const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 8080;

const apiKey = "AIzaSyDL8lTQK78cwDfySVT_8JDbDXkgJyUcfV4"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { temperature: 0.3, topP: 0.95, topK: 64, maxOutputTokens: 8192 }
});

const SYSTEM_PROMPT = `
Your name is GPT, developed by Kish. Always provide up-to-date and relevant responses.
`;

app.use(express.json());

app.route('/gpt')
  .get(async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).send("No query provided");

    try {
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nHuman: ${query}`);
      return res.status(200).send(result.response.text());
    } catch {
      return res.status(500).send("Failed to generate response");
    }
  })
  .post(async (req, res) => {
    const query = req.body.query;
    if (!query) return res.status(400).send("No query provided");

    try {
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nHuman: ${query}`);
      return res.status(200).send(result.response.text());
    } catch {
      return res.status(500).send("Failed to generate response");
    }
  });

app.listen(port, () => {
  console.log(`GPT API listening at http://localhost:${port}`);
});
