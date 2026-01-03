require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/home');
const movieRoutes = require('./routes/movieRoutes');
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
    if (!origin) return callback(null, true); // Postman / Server requests

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
app.use('/api/movie', movieRoutes);
app.use('/api/ai', aiChatRoute); // Gemini AI

/* =========================
   HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.send('🎬 Filmi Bharat Backend v3 (AI + Secure)');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🤖 Gemini AI Enabled');
  console.log('🎥 Movie API Ready');
});
