const express = require('express');
const tmdbService = require('../services/tmdbService');
const router = express.Router();

// 4 Home Categories (Indian Movies + Web Series)
router.get('/trending', async (req, res) => {
  try {
    const movies = await tmdbService.getTrendingIndia();
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/popular-webseries', async (req, res) => {
  try {
    const series = await tmdbService.getPopularWebSeriesIndia();
    res.json({ success: true, data: series });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/top-imdb', async (req, res) => {
  try {
    const topRated = await tmdbService.getTopRatedIndia();
    res.json({ success: true, data: topRated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const upcoming = await tmdbService.getUpcomingIndia();
    res.json({ success: true, data: upcoming });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
