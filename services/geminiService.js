const { GoogleGenerativeAI } = require('@google/generative-ai');

// API Key সেটআপ
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async chatWithUser(userMessage) {
    try {
      // ✅ এখানে এপিআই ভার্সন 'v1beta' এপিআই কল লেভেলে সেট করুন
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1beta" } // এটি বাধ্যতামূলক
      );

      const prompt = `You are 'Filmi Bharat AI', a helpful movie assistant... User says: ${userMessage}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Assistant Error:', error.message);
      return "I'm sorry, I'm having trouble connecting right now.";
    }
  }
}

module.exports = new GeminiService();
