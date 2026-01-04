const axios = require('axios');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

class TMDBService {
  // ১. লেটেস্ট ট্রেন্ডিং ইন্ডিয়ান মুভি ফিল্টার (২০২৪-২০২৫)
  async getTrendingIndia() {
    const response = await axios.get(`${TMDB_BASE}/discover/movie`, {
      params: {
        api_key: API_KEY,
        region: 'IN',
        with_original_language: 'hi|te|ta|ml|be|kn', // ভারতীয় প্রধান ভাষাগুলো
        primary_release_year: 2025, // পুরনো মুভি আসা বন্ধ করতে
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results.slice(0, 20);
  }

  async getMovieDetails(id) {
    const response = await axios.get(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}&region=IN&append_to_response=credits,videos,watch/providers`);
    return response.data;
  }

  async getPopularWebSeriesIndia() {
    // Netflix(447), Amazon(102), Disney+(119)
    const response = await axios.get(`${TMDB_BASE}/discover/tv?api_key=${API_KEY}&region=IN&with_networks=447|102|119&sort_by=popularity.desc`);
    return response.data.results.slice(0, 20);
  }

  async getTopRatedIndia() {
    const response = await axios.get(`${TMDB_BASE}/movie/top_rated?api_key=${API_KEY}&region=IN&with_original_language=hi|te|ta`);
    return response.data.results.slice(0, 20);
  }

  async getUpcomingIndia() {
    const response = await axios.get(`${TMDB_BASE}/movie/upcoming?api_key=${API_KEY}&region=IN`);
    return response.data.results.slice(0, 20);
  }
}

module.exports = new TMDBService();
