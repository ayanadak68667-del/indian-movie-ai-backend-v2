const express = require('express');
const tmdbService = require('../services/tmdbService');
const youtubeService = require('../services/youtubeService');
const geminiService = require('../services/geminiService');
const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await tmdbService.getMovieDetails(movieId);
    const trailer = await youtubeService.getTrailer(movie.title);
    const playlist = await youtubeService.getPlaylist(movie.title);
    const aiBlog = await geminiService.generateMovieBlog(movie);
    
    res.json({ 
      success: true,
      movieId,
      movie,
      trailer,
      playlist,
      aiBlog
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
