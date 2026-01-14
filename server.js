require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Routes
const homeRoutes = require('./routes/home');
const movieRoutes = require('./routes/movie');
const aiChatRoute = require('./routes/aiChat');

const app = express();

/* ============================
   CORS — HOSTINGER + RENDER SAFE
============================ */
app.use(cors({
  origin: [
    "https://raatkibaat.in",
    "https://www.raatkibaat.in",
    "https://horizons.hostinger.com",
    "https://indian-movie-ai-backend-v2.onrender.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Allow preflight requests
app.options('*', cors());

/* ============================
   BODY PARSER
============================ */
app.use(express.json());

/* ============================
   RATE LIMIT (AI CHAT PROTECTION)
============================ */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    reply: "Too many requests. Please wait a minute 🍿"
  }
});

// Allow OPTIONS through limiter
app.use('/api/ai', (req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
}, chatLimiter);

/* ============================
   API ROUTES (MATCH FRONTEND)
============================ */
app.use('/home', homeRoutes);      // /home/trending etc
app.use('/movie', movieRoutes);    // /movie/:id , /movie/search
app.use('/api/ai', aiChatRoute);   // Filmi AI

/* ============================
   DATABASE
============================ */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

/* ============================
   HEALTH CHECK
============================ */
app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    api: "online",
    ai: "ready",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString()
  });
});

/* ============================
   ROOT
============================ */
app.get('/', (req, res) => {
  res.send('🎬 Filmi Bharat Backend Running');
});

/* ============================
   SERVER START
============================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
