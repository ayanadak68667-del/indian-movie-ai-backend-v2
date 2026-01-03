require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/home');
const movieRoutes = require('./routes/movie');

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
    // Allow Postman / server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Preflight support
app.options('*', cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   MONGODB
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

/* =========================
   ROUTES
========================= */
app.use('/api/home', homeRoutes);
app.use('/api/movie', movieRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.send('Filmi Bharat Backend v2 ✅');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
