const express = require('express');
const router = express.Router();

const tmdbService = require('../services/tmdbService');
const youtubeService = require('../services/youtubeService');
const { generateMovieBlog } = require('../services/groqService');
const mongoCache = require('../services/mongoCacheService');

// ⏳ Cache expiry (24 hours)
const CACHE_TTL = 1000 * 60 * 60 * 24;

// ---------------------------------------------------------
// 🔍 1. SEARCH MOVIES (এটি অবশ্যই সবার উপরে থাকবে)
// ---------------------------------------------------------
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;

    if (!query || query.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const results = await tmdbService.searchMovie(query);

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// ---------------------------------------------------------
// 🏠 2. HOME PAGE SECTIONS (Trending, Upcoming, etc.)
// ---------------------------------------------------------

// Trending Now
router.get('/home/trending', async (req, res) => {
  const data = await tmdbService.getTrendingNow();
  res.json({ success: true, data });
});

// Popular Web Series
router.get('/home/series', async (req, res) => {
  const data = await tmdbService.getPopularWebSeries();
  res.json({ success: true, data });
});

// Top Rated
router.get('/home/top-rated', async (req, res) => {
  const data = await tmdbService.getTopRated();
  res.json({ success: true, data });
});

// ---------------------------------------------------------
// 🎬 3. MOVIE DETAILS BY ID (এটি শেষে থাকবে)
// ---------------------------------------------------------
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
      message: 'Failed to load movie details'
    });
  }
});

module.exports = router;
