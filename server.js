require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const homeRoutes = require('./routes/home');
const movieRoutes = require('./routes/movie');
const aiChatRoute = require('./routes/aiChat');

const app = express();

/* =========================
   MANUAL CORS FIX (THE WALL BREAKER)
========================= */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/* =========================
   RATE LIMITING (SECURITY)
========================= */
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: { success: false, reply: "Slow down! Try again in a minute. 🍿" }
});

/* =========================
   MIDDLEWARE & ROUTES
========================= */
app.use(express.json());

app.use('/api/home', homeRoutes);
app.use('/api/movies', movieRoutes); 
app.use('/api/ai', chatLimiter, aiChatRoute);

/* =========================
   DATABASE
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected! System Ready.'))
  .catch(err => console.error('❌ MongoDB Error:', err));

/* =========================
   SMART HEALTH CHECK ✅
========================= */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    ai: 'online',
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString()
  });
});

/* =========================
   HOME
========================= */
app.get('/', (req, res) => {
  res.send('🎬 Filmi Bharat Backend - Final Version');
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Final Server running on port ${PORT}`);
});
