const axios = require('axios');
const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

class TMDBService {

  async safeGet(url, params = {}) {
    try {
      const res = await axios.get(url, {
        params: { api_key: API_KEY, ...params },
        timeout: 10000
      });
      return res.data;
    } catch (e) {
      console.error("TMDB ERROR:", url);
      return null;
    }
  }

  // ১. সার্চ বারের জন্য (Search Results)
  async searchMovie(query) {
    const data = await this.safeGet(`${TMDB_BASE}/search/movie`, {
      query,
      language: 'en-IN',
      region: 'IN'
    });
    return data?.results || [];
  }

  // ২. মুড ডিসকভারি (Mood Discovery - Horror, Romance, etc.)
  // ইউজার ইমোজিতে ক্লিক করলে এই ফাংশনটি কাজ করবে
  async getMoviesByGenre(genreId) {
    const data = await this.safeGet(`${TMDB_BASE}/discover/movie`, {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      region: 'IN',
      with_original_language: 'bn|hi|en'
    });
    return data?.results?.slice(0, 10) || [];
  }

  // ৩. ট্রেন্ডিং সেকশন (Trending Now Top 10)
  async getTrendingNow() {
    const data = await this.safeGet(`${TMDB_BASE}/trending/movie/day`, {
      region: 'IN'
    });
    return data?.results?.slice(0, 10) || [];
  }

  // ৪. পপুলার ওয়েব সিরিজ (Popular Web Series)
  async getPopularWebSeries() {
    const data = await this.safeGet(`${TMDB_BASE}/tv/popular`, {
      region: 'IN',
      with_original_language: 'bn|hi|en'
    });
    return data?.results?.slice(0, 10) || [];
  }

  // ৫. টপ আইএমডিবি রেটেড (Top IMDb Rated)
  async getTopRated() {
    const data = await this.safeGet(`${TMDB_BASE}/movie/top_rated`, {
      region: 'IN'
    });
    return data?.results?.slice(0, 10) || [];
  }

  // ৬. আপকামিং রিলিজ (Upcoming Releases)
  async getUpcoming() {
    const data = await this.safeGet(`${TMDB_BASE}/movie/upcoming`, {
      region: 'IN'
    });
    return data?.results?.slice(0, 10) || [];
  }
}

module.exports = new TMDBService();
