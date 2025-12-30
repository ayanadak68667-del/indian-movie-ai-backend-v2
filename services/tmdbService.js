const axios = require('axios');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

class TMDBService {
  async getTrendingIndia() {
    const response = await axios.get(`${TMDB_BASE}/trending/movie/week?api_key=${API_KEY}&region=IN`);
    return response.data.results.slice(0, 20);
  }

  async getMovieDetails(id) {
    const response = await axios.get(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}&region=IN&append_to_response=credits,videos,watch/providers`);
    return response.data;
  }

  async getPopularWebSeriesIndia() {
    // Netflix(447), Amazon(102), Disney+(119)
    const response = await axios.get(`${TMDB_BASE}/discover/tv?api_key=${API_KEY}&region=IN&with_networks=447,102,119`);
    return response.data.results.slice(0, 20);
  }

  async getTopRatedIndia() {
    const response = await axios.get(`${TMDB_BASE}/movie/top_rated?api_key=${API_KEY}&region=IN`);
    return response.data.results.slice(0, 20);
  }

  async getUpcomingIndia() {
    const response = await axios.get(`${TMDB_BASE}/movie/upcoming?api_key=${API_KEY}&region=IN`);
    return response.data.results.slice(0, 20);
  }
}

module.exports = new TMDBService();
