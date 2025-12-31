const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async generateMovieBlog(movie) {
    try {
      const castNames = movie.credits?.cast?.slice(0, 3).map(c => c.name).join(', ') || 'N/A';
      const genres = movie.genres?.map(g => g.name).join(', ') || 'N/A';
      
      const prompt = `Filmi Bharat SEO Blog:

MOVIE: ${movie.title} (${movie.release_date?.slice(0,4)})
IMDB: ${movie.vote_average}/10 | Genres: ${genres}
Budget: $${(movie.budget/1000000).toFixed(1)}M | Revenue: $${(movie.revenue/1000000).toFixed(1)}B
Top Cast: ${castNames}

**Required Format:**
1. **Synopsis** (1-2 paragraphs)
2. **Performance Spotlight** (${castNames})
3. **The Scorecard** (3-5 bullets)
4. **The Caveat** (2-3 cons) 
5. **Data Deep Dive** (ROI analysis)
6. **Who Should Watch?** (${genres} fans)`;

      // ✅ 100% WORKING MODEL (Official Docs):
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return await result.response.text();
    } catch (error) {
      console.error('Gemini Error FULL:', error);
      return 'AI Blog temporarily unavailable. Coming soon!';
    }
  }
}

module.exports = new GeminiService();
