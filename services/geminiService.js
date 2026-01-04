// services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async chatWithUser(userMessage) {
    try {
      // ✅ v1beta ভার্সন ব্যবহার করা নিশ্চিত করুন
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
      }, { apiVersion: 'v1beta' }); // ← এটি যোগ করুন

      const prompt = `You are 'Filmi Bharat AI'... User says: ${userMessage}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini Assistant Error:', error.message);
      return "Assistant is currently unavailable.";
    }
  }
}
