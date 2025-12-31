const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async generateMovieBlog(movie) {
    try {
      const castNames = movie.credits?.cast?.slice(0, 3).map(c => c.name).join(', ') || 'N/A';
      const genres = movie.genres?.map(g => g.name).join(', ') || 'N/A';
      const budget = (movie.budget/1000000).toFixed(1);
      const revenue = (movie.revenue/1000000).toFixed(1);
      
      const prompt = `Filmi Bharat AI Analysis & Insights (${movie.title}):

**1. Synopsis**: ${movie.overview}
**2. Performance Spotlight**: ${castNames}
**3. The Scorecard** (Why watch):
**4. The Caveat** (Cons):
**5. Data Deep Dive**: Budget $${budget}M | Revenue $${revenue}B | ROI Analysis
**6. Who Should Watch?**: ${genres} fans

Write human-like SEO content in English following EXACT structure above.`;

      // ✅ v1beta API Version + Blueprint Perfect
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        apiVersion: 'v1beta'  // ← MAGIC FIX!
      });
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini Error:', error.message);
      return `AI Blog temporarily unavailable. Error: ${error.message.substring(0, 100)}`;
    }
  }
}

module.exports = new GeminiService();
