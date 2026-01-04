// services/mongoCacheService.js (Updated for your route)
const MovieModel = require('../models/Movie');

class MongoCacheService {
  async get(tmdbId) {
    try {
      return await MovieModel.findOne({ tmdbId });
    } catch (error) {
      return null;
    }
  }

  // এখন এটি পুরো একটি অবজেক্ট (data) গ্রহণ করবে
  async set(data) {
    try {
      await MovieModel.findOneAndUpdate(
        { tmdbId: data.tmdbId },
        data, // পুরো অবজেক্টটি সরাসরি সেভ হবে
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Cache Set Error:', error);
    }
  }
}

module.exports = new MongoCacheService();
