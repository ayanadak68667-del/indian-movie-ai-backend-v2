const { GoogleGenerativeAI } = require('@google/generative-ai');

// API Key সেটআপ
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async chatWithUser(userMessage) {
    try {
      // ✅ সঠিক মডেলের নাম: শুধু "gemini-1.5-flash" ব্যবহার করুন
      // নামের শেষে -001 বা -latest যোগ করার প্রয়োজন নেই
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // প্রম্পট সেটআপ
      const prompt = `You are 'Filmi Bharat AI', a helpful movie assistant for Indian cinema. 
      Keep your answers concise and cinematic. User says: ${userMessage}`;

      // টেক্সট জেনারেশন কল
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      // বিস্তারিত এরর লগিং (Render কনসোলে দেখা যাবে)
      console.error('Gemini Assistant Error:', error.message);
      
      // এরর মেসেজ হ্যান্ডলিং
      if (error.message.includes('404')) {
        return "Model not found. Please check the model name in GeminiService.";
      }
      return "I'm sorry, I'm having trouble connecting to my film database right now.";
    }
  }
}

module.exports = new GeminiService();
