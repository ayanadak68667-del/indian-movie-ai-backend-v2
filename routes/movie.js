const express = require('express');
const router = express.Router();

const tmdbService = require('../services/tmdbService');
const youtubeService = require('../services/youtubeService');
const { generateMovieBlog } = require('../services/groqService');
const mongoCache = require('../services/mongoCacheService');

// ⏳ Cache expiry (24 hours)
const CACHE_TTL = 1000 * 60 * 60 * 24;

router.get('/:id', async (req, res) => {
  const movieId = req.params.id;

  try {

    // 1️⃣ MongoDB Cache Check
    const cachedMovie = await mongoCache.get(movieId);

    const isStale = cachedMovie?.lastUpdated
      ? (Date.now() - new Date(cachedMovie.lastUpdated).getTime()) > CACHE_TTL
      : true;

    if (cachedMovie && !isStale) {
      return res.json({
        success: true,
        movie: cachedMovie.details || {},
        trailer: cachedMovie.trailer || null,
        playlist: cachedMovie.playlist || [],
        aiBlog: cachedMovie.aiBlog || {},
        watchProviders: cachedMovie.watchProviders || {},
        meta: cachedMovie.meta || {},
        lastUpdated: cachedMovie.lastUpdated,
        cached: true
      });
    }

    // 2️⃣ TMDB Core Fetch
    const movie = await tmdbService.getMovieDetails(movieId);
    if (!movie) throw new Error("TMDB failed");

    // 3️⃣ Parallel external calls
    const [
      trailer,
      playlist,
      aiBlog,
      watchProviders
    ] = await Promise.all([
      youtubeService.getTrailer(movie.title).catch(() => null),
      youtubeService.getPlaylist(movie.title).catch(() => []),
      generateMovieBlog(movie).catch(() => ({})),
      tmdbService.getWatchProviders(movieId).catch(() => ({}))
    ]);

    // 4️⃣ Meta flags build
    const meta = {
      isTrending: movie.popularity > 100,
      isNew: (Date.now() - new Date(movie.release_date).getTime()) / (1000 * 60 * 60 * 24) < 60,
      popularity: movie.popularity || 0,
      imdbRating: movie.vote_average || 0
    };

    // 5️⃣ Final object
    const movieData = {
      tmdbId: movieId,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      details: movie,
      trailer: trailer || null,
      playlist: playlist || [],
      aiBlog: aiBlog || {},
      watchProviders: watchProviders || {},
      meta,
      lastUpdated: new Date()
    };

    // 6️⃣ Save / Update cache
    await mongoCache.set(movieData);

    // 7️⃣ Response
    res.json({
      success: true,
      movie: movieData.details,
      trailer: movieData.trailer,
      playlist: movieData.playlist,
      aiBlog: movieData.aiBlog,
      watchProviders: movieData.watchProviders,
      meta: movieData.meta,
      lastUpdated: movieData.lastUpdated,
      cached: false
    });

  } catch (error) {
    console.error('Movie Route Error:', error.message);
    res.status(500).json({
      success: false,
      movie: {},
      trailer: null,
      playlist: [],
      aiBlog: {},
      watchProviders: {},
      meta: {},
      lastUpdated: null,
      message: 'Failed to load movie details'
    });
  }
});

module.exports = router;
