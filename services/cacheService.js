const Redis = require('redis');
const client = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

class CacheService {
  async get(key) {
    try {
      return await client.get(key);
    } catch {
      return null;
    }
  }

  async set(key, value, ttl = 3600) { // 1hr default
    try {
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis cache error:', error);
    }
  }
}

module.exports = new CacheService();
