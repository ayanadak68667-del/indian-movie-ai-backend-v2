const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini Config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // AI-এর জন্য একটি পার্সোনালিটি সেট করা
        const prompt = `You are Filmi Bharat AI Assistant. Help users find Indian movies, explain reviews, and answer cinematic questions. User says: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        res.status(500).json({ error: "AI Assistant is currently unavailable" });
    }
});

module.exports = router;
