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

  // ---------------- HOME SECTIONS ----------------

  async getTrendingIndia() {
    const data = await this.safeGet(`${TMDB_BASE}/discover/movie`, {
      region: 'IN',
      with_original_language: 'hi|te|ta|ml|be|kn',
      sort_by: 'popularity.desc'
    });
    return data?.results?.slice(0, 20) || [];
  }

  async getPopularWebSeriesIndia() {
    const data = await this.safeGet(`${TMDB_BASE}/discover/tv`, {
      region: 'IN',
      with_networks: '447|102|119',
      sort_by: 'popularity.desc'
    });
    return data?.results?.slice(0, 20) || [];
  }

  async getTopRatedIndia() {
    const data = await this.safeGet(`${TMDB_BASE}/movie/top_rated`, {
      region: 'IN',
      with_original_language: 'hi|te|ta'
    });
    return data?.results?.slice(0, 20) || [];
  }

  async getUpcomingIndia() {
    const data = await this.safeGet(`${TMDB_BASE}/movie/upcoming`, {
      region: 'IN'
    });
    return data?.results?.slice(0, 20) || [];
  }

  // ---------------- MOVIE CORE ----------------

  async getMovieDetails(id) {
    return await this.safeGet(`${TMDB_BASE}/movie/${id}`, {
      region: 'IN',
      append_to_response: 'credits,videos,external_ids'
    });
  }

  async getWatchProviders(id) {
    const data = await this.safeGet(`${TMDB_BASE}/movie/${id}/watch/providers`);
    return this.normalizeWatchProviders(data?.results?.IN);
  }

  // ---------------- NORMALIZERS ----------------

  normalizeWatchProviders(providers = {}) {
    const list = providers?.flatrate || [];

    const has = (name) =>
      list.some(p =>
        p.provider_name.toLowerCase().includes(name)
      );

    return {
      netflix: has("netflix"),
      prime: has("prime"),
      hotstar: has("hotstar") || has("disney"),
      sonyLiv: has("sony"),
      zee5: has("zee"),
      link: providers?.link || ""
    };
  }

}

module.exports = new TMDBService();
