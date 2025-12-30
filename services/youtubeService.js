const axios = require('axios');

const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

class YouTubeService {
  // Official Trailer (Movie Title + "Official Trailer")
  async getTrailer(movieTitle) {
    try {
      const query = `${movieTitle} official trailer`;
      const response = await axios.get(`${YOUTUBE_BASE}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoDuration: 'long',
          maxResults: 3,
          key: API_KEY
        }
      });

      // Return first official trailer
      const trailer = response.data.items[0];
      return {
        videoId: trailer.id.videoId,
        title: trailer.snippet.title,
        thumbnail: trailer.snippet.thumbnails.medium.url,
        embedUrl: `https://www.youtube.com/embed/${trailer.id.videoId}`
      };
    } catch (error) {
      console.error('Trailer fetch error:', error.message);
      return null;
    }
  }

  // Movie Songs Playlist (All songs)
  async getPlaylist(movieTitle) {
    try {
      const query = `${movieTitle} full songs jukebox`;
      const response = await axios.get(`${YOUTUBE_BASE}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'playlist',
          maxResults: 1,
          key: API_KEY
        }
      });

      const playlist = response.data.items[0];
      return {
        playlistId: playlist.id.playlistId,
        title: playlist.snippet.title,
        thumbnail: playlist.snippet.thumbnails.medium.url,
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${playlist.id.playlistId}`
      };
    } catch (error) {
      console.error('Playlist fetch error:', error.message);
      return null;
    }
  }
}

module.exports = new YouTubeService();
