const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
    unique: true, // একই মুভি যেন বারবার সেভ না হয়
  },
  title: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
  },
  release_date: {
    type: String,
  },
  // YouTube Data
  trailer: {
    type: Object, // embedUrl সহ পুরো অবজেক্ট সেভ করার জন্য
    default: null
  },
  playlist: {
    type: Object,
    default: null
  },
  // AI Generated Blog
  aiBlog: {
    type: String,
    required: true,
  },
  // TMDB Full Details (ভবিষ্যতে কাজে লাগতে পারে)
  details: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // ৩০ দিন পর অটো ডিলিট হবে (Optional Caching Strategy)
  }
});

module.exports = mongoose.model('Movie', MovieSchema);
