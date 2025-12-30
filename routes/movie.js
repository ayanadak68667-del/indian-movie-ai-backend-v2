const express = require('express');
const tmdbService = require('../services/tmdbService');
const router = express.Router();

// Test endpoint
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Movie routes v2 ready!',
    endpoints: ['/api/movie/:id', '/api/movie/:id/blog']
  });
});

// Movie details + AI blog endpoint
router.get('/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await tmdbService.getMovieDetails(movieId);
    
    res.json({ 
      success: true, 
      movieId,
      data: movie,
      status: 'AI blog + YouTube trailer coming soon'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Blog endpoint (placeholder)
router.get('/:id/blog', (req, res) => {
  res.json({ 
    success: true, 
    movieId: req.params.id, 
    status: 'Gemini AI blog (8 sections) ready for integration',
    sections: ['Synopsis', 'Box Office', 'Pros/Cons', 'Cast Analysis']
  });
});

module.exports = router;
