const MovieModel = require('../models/Movie');

class MongoCacheService {
  // ক্যাশ থেকে ডেটা খোঁজা
  async get(tmdbId) {
    try {
      const cachedData = await MovieModel.findOne({ tmdbId });
      return cachedData ? cachedData : null;
    } catch (error) {
      console.error('Cache Get Error:', error);
      return null;
    }
  }

  // ক্যাশ-এ ডেটা সেভ করা (যদি আগে না থাকে)
  async set(tmdbId, movieData, aiBlog, trailer, playlist) {
    try {
      await MovieModel.findOneAndUpdate(
        { tmdbId },
        {
          tmdbId,
          title: movieData.title,
          poster_path: movieData.poster_path,
          release_date: movieData.release_date,
          trailer,
          playlist,
          aiBlog,
          details: movieData
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Cache Set Error:', error);
    }
  }
}

module.exports = new MongoCacheService();
