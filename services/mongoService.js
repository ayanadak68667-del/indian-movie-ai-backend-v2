const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const blogCacheSchema = new mongoose.Schema({
  movieId: String,
  aiBlog: String,
  cachedAt: { type: Date, default: Date.now }
});

const BlogCache = mongoose.model('BlogCache', blogCacheSchema);

class MongoService {
  async saveBlog(movieId, aiBlog) {
    await BlogCache.findOneAndUpdate(
      { movieId }, 
      { movieId, aiBlog, cachedAt: new Date() },
      { upsert: true }
    );
  }

  async getCachedBlog(movieId) {
    const cache = await BlogCache.findOne({ movieId });
    return cache?.aiBlog || null;
  }

  async isCacheFresh(movieId) {
    const cache = await BlogCache.findOne({ movieId });
    if (!cache) return false;
    return (Date.now() - cache.cachedAt) < 24 * 60 * 60 * 1000; // 24hrs
  }
}

module.exports = new MongoService();
