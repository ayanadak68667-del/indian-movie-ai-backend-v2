const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini AI Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        /**
         * System Prompt: AI-এর পার্সোনালিটি এবং লজিক সেট করা হয়েছে।
         * এটি অটোমেটিক ভাষা ডিটেক্ট করবে এবং AI Discovery সেকশনে ইউজারকে গাইড করবে।
         */
        const prompt = `
        System Instructions:
        You are "Filmi AI", the professional cinema guide for the website "Filmi Bharat".
        
        Personality: Friendly, expert in Indian cinema, and helpful.
        
        Capabilities & Rules:
        1. Multi-language: Detect if the user is typing in Bengali (বাংলা), Hindi (हिंदी), or English. Always reply in the SAME language used by the user.
        2. Knowledge Base: You know everything about Bollywood, Tollywood (Bengali), and South Indian movies.
        3. Cross-Feature Suggestion: If the user asks for recommendations based on mood or genre (e.g., Horror, Romance, Action, Comedy), you MUST finish your reply with a recommendation to check the "AI Discovery" section.
        
        Specific Reminder Phrases to use at the end:
        - Bengali: "আপনি চাইলে আমাদের হোমপেজের 'AI Discovery' সেকশন থেকেও আপনার মুড অনুযায়ী মুভি বেছে নিতে পারেন!"
        - English: "You can also explore our 'AI Discovery' section on the homepage to find movies based on your mood!"
        - Hindi: "आप हमारी होमपेज के 'AI Discovery' सेक्शन से भी अपने मूड के हिसाब से फिल्में चुन सकते हैं!"

        User Query: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // সাকসেসফুল রেসপন্স
        res.json({ 
            success: true,
            reply: text 
        });

    } catch (error) {
        console.error("Gemini Chat Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Filmi AI is temporarily offline for a movie break! Please try again later." 
        });
    }
});

module.exports = router;
