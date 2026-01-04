const axios = require('axios');

const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

class YouTubeService {
  // ১. অফিশিয়াল ট্রেলার খোঁজার উন্নত লজিক
  async getTrailer(movieTitle) {
    try {
      if (!movieTitle) return null;
      
      const query = `${movieTitle} official trailer hindi`; // ইন্ডিয়ান কন্টেন্টের জন্য 'hindi' বা ল্যাঙ্গুয়েজ যোগ করা ভালো
      const response = await axios.get(`${YOUTUBE_BASE}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoEmbeddable: 'true', // নিশ্চিত করবে ভিডিওটি আপনার সাইটে প্লে হবে
          maxResults: 1, // কোটা বাঁচাতে রেজাল্ট কমিয়ে ১ করা হলো
          key: API_KEY
        }
      });

      if (!response.data.items || response.data.items.length === 0) return null;

      const trailer = response.data.items[0];
      return {
        videoId: trailer.id.videoId,
        title: trailer.snippet.title,
        thumbnail: trailer.snippet.thumbnails.high?.url || trailer.snippet.thumbnails.medium.url,
        embedUrl: `https://www.youtube.com/embed/${trailer.id.videoId}`
      };
    } catch (error) {
      console.error('Trailer fetch error:', error.message);
      return null;
    }
  }

  // ২. মুভি প্লেলিস্ট/জুকবক্স খোঁজা
  async getPlaylist(movieTitle) {
    try {
      if (!movieTitle) return null;

      const query = `${movieTitle} movie songs jukebox`;
      const response = await axios.get(`${YOUTUBE_BASE}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'playlist|video', // কখনও কখনও জুকবক্স ভিডিও আকারে থাকে, তাই দুটোই চেক করা ভালো
          maxResults: 1,
          key: API_KEY
        }
      });

      if (!response.data.items || response.data.items.length === 0) return null;

      const item = response.data.items[0];
      const isPlaylist = item.id.kind === 'youtube#playlist';

      return {
        id: isPlaylist ? item.id.playlistId : item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        embedUrl: isPlaylist 
          ? `https://www.youtube.com/embed/videoseries?list=${item.id.playlistId}`
          : `https://www.youtube.com/embed/${item.id.videoId}`
      };
    } catch (error) {
      console.error('Playlist fetch error:', error.message);
      return null;
    }
  }
}

module.exports = new YouTubeService();
