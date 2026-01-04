const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Trending Indian Movies
router.get('/trending', async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        region: 'IN',
        with_original_language: 'hi,te,ta,ml,kn',
        primary_release_year: year,
        sort_by: 'popularity.desc'
      }
    });

    res.json({ success: true, data: response.data.results });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch trending movies' });
  }
});

// Popular Indian Web Series
router.get('/popular-webseries', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
      params: {
        api_key: API_KEY,
        region: 'IN',
        with_original_language: 'hi'
      }
    });

    res.json({ success: true, data: response.data.results });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch web series' });
  }
});

// Upcoming Indian Movies
router.get('/upcoming', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: {
        api_key: API_KEY,
        region: 'IN'
      }
    });

    res.json({ success: true, data: response.data.results });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming movies' });
  }
});

module.exports = router;
