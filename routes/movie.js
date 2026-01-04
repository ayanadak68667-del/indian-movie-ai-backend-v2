const express = require('express');
const router = express.Router();

const tmdbService = require('../services/tmdbService');
const youtubeService = require('../services/youtubeService');
const { generateMovieBlog } = require('../services/groqService');
const mongoCache = require('../services/mongoCacheService');

router.get('/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    // 1️⃣ MongoDB Cache Check
    const cachedMovie = await mongoCache.get(movieId);
    if (cachedMovie) {
      return res.json({
        success: true,
        movie: cachedMovie.details,
        trailer: cachedMovie.trailer,
        playlist: cachedMovie.playlist,
        aiBlog: cachedMovie.aiBlog,
        cached: true
      });
    }

    // 2️⃣ TMDB API Fetch
    const movie = await tmdbService.getMovieDetails(movieId);

    // 3️⃣ Parallel Calls (Fault-Tolerant)
    const [trailer, playlist, aiBlog] = await Promise.all([
      youtubeService.getTrailer(movie.title).catch(() => null),
      youtubeService.getPlaylist(movie.title).catch(() => null),
      generateMovieBlog(movie).catch(() => 'AI Blog is being generated...')
    ]);

    // 4️⃣ Save to MongoDB (Upsert Cache)
    await mongoCache.set({
      tmdbId: movieId,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      details: movie,
      trailer,
      playlist,
      aiBlog
    });

    res.json({
      success: true,
      movie,
      trailer,
      playlist,
      aiBlog,
      cached: false
    });

  } catch (error) {
    console.error('Movie Route Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load movie details'
    });
  }
});

module.exports = router;
