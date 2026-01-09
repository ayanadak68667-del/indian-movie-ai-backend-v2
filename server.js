require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/home');
const movieRoutes = require('./routes/movie');
const aiChatRoute = require('./routes/aiChat');

const app = express();

/* =========================
   CORS (PRODUCTION SAFE)
========================= */
const allowedOrigins = [
  'https://raatkibaat.in',
  'https://www.raatkibaat.in',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.options('*', cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   DATABASE
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

/* =========================
   ROUTES
========================= */
app.use('/api/home', homeRoutes);

// এখানে আমি 'movie' থেকে 'movies' (s যুক্ত) করে দিলাম 
// যাতে আপনার ব্রাউজারের লিঙ্কের সাথে (/api/movies/search/...) হুবহু মিলে যায়।
app.use('/api/movies', movieRoutes); 

app.use('/api/ai', aiChatRoute);

/* =========================
   HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.send('🎬 Filmi Bharat Backend v3 (AI + Secure)');
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
