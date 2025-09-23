// Gemini API proxy server using Node.js and Express
// Save this as server.js and run with: node server.js
// Make sure to install dependencies: npm install express cors node-fetch

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001; // You can change this port if needed
const GEMINI_API_KEY = 'AIzaSyAUD436Mi06WX5hk2VMqtjF2x2OCVS6qd4';

app.use(cors());
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'No question provided.' });

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      contents: [{ parts: [{ text: question }]}]
    };
    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await apiRes.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      res.json({ answer: data.candidates[0].content.parts[0].text });
    } else {
      res.json({ answer: 'Sorry, no answer received.' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Error contacting Gemini API.' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy server running on http://localhost:${PORT}`);
});
