const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({

  tmdbId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  title: String,
  poster_path: String,
  release_date: String,

  // TMDB Full Details
  details: {
    type: Object,
    default: {}
  },

  // YouTube
  trailer: {
    type: Object,
    default: null
  },

  playlist: {
    type: Array,
    default: []
  },

  // ✅ Structured AI Blog
  aiBlog: {
    type: Object,
    default: {}
  },

  // ✅ OTT Providers
  watchProviders: {
    type: Object,
    default: {}
  },

  // ✅ Meta Flags
  meta: {
    isTrending: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
    imdbRating: { type: Number, default: 0 }
  },

  // ✅ Cache / Trust badge
  lastUpdated: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true }); // createdAt + updatedAt auto

module.exports = mongoose.model('Movie', MovieSchema);
