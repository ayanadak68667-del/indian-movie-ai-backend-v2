const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// 1. Trending Indian Movies (Filtered for 2024-2025)
router.get('/trending', async (req, res) => {
  try {
    // ডিফল্টভাবে ২০২৫ সাল সেট করা হলো যাতে ওল্ড মুভি না আসে
    const year = req.query.year || 2025; 

    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        region: 'IN',
        with_original_language: 'hi|te|ta|ml|be|kn', // কমা (,) এর বদলে পাইপ (|) ব্যবহার করা বেশি কার্যকর TMDB-তে
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

// 2. Popular Indian Web Series
router.get('/popular-webseries', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
      params: {
        api_key: API_KEY,
        region: 'IN',
        with_original_language: 'hi|te|ta|ml|be|kn' // ভারতীয় ওয়েব সিরিজের জন্য
      }
    });

    res.json({ success: true, data: response.data.results });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch web series' });
  }
});

// 3. Upcoming Indian Movies
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
