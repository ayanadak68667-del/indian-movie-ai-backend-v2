const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  // মুভি ব্লগ এখন Groq লিখবে, Gemini শুধু ইউজারের সাথে চ্যাট করবে
  async chatWithUser(userMessage) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash' 
      });
      
      const prompt = `You are 'Filmi Bharat AI', a friendly and professional movie expert from India. 
      Answer questions about movies, series, and reviews. 
      User says: ${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Assistant Error:', error.message);
      return "I'm sorry, your Filmi Bharat assistant is currently resting. Please try again later!";
    }
  }
}

module.exports = new GeminiService();
