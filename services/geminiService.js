const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async generateMovieBlog(movie) {
    const prompt = `
Write a SEO-optimized movie blog in English (human-like style) with these EXACT sections:
1. Synopsis (1-2 paragraphs)
2. Performance Spotlight (${movie.credits?.cast?.slice(0,3)?.map(c=>c.name).join(', ')})
3. The Scorecard (3-5 bullet points - why watch)
4. The Caveat (2-3 honest cons)
5. Data Deep Dive (Budget: $${movie.budget/1000000}M, Revenue: $${movie.revenue/1000000}B)
6. Who Should Watch This? (Target audience by genre: ${movie.genres?.map(g=>g.name).join(', ')})
    
Movie: ${movie.title} (${movie.release_date?.slice(0,4)})
IMDB: ${movie.vote_average}/10 | Genre: ${movie.genres?.map(g=>g.name).join(', ')}
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return await result.response.text();
  }
}

module.exports = new GeminiService();
