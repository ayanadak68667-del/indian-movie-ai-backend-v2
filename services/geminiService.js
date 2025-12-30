const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async generateMovieBlog(movie) {
    const castNames = movie.credits?.cast?.slice(0, 3).map(c => c.name).join(', ') || 'N/A';
    const genres = movie.genres?.map(g => g.name).join(', ') || 'N/A';
    
    const prompt = `Write SEO-optimized Filmi Bharat blog (English, human-like):

MOVIE: ${movie.title} (${movie.release_date?.slice(0,4)})
IMDB: ${movie.vote_average}/10 | Genres: ${genres}
Budget: $${(movie.budget/1000000).toFixed(1)}M | Revenue: $${(movie.revenue/1000000).toFixed(1)}B
Cast: ${castNames}

**EXACT Structure:**
1. **Synopsis** (1-2 paragraphs)
2. **Performance Spotlight** (${castNames})
3. **The Scorecard** (3-5 bullets - why watch)
4. **The Caveat** (2-3 honest cons)
5. **Data Deep Dive** (Budget/Revenue analysis)
6. **Who Should Watch?** (${genres} fans)

SEO Keywords: ${movie.title}, ${genres}, Indian cinema, box office`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return await result.response.text();
  }
}

module.exports = new GeminiService();
