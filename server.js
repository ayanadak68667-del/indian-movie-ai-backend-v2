require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit'); // রেট লিমিট প্যাকেজ

const homeRoutes = require('./routes/home');
const movieRoutes = require('./routes/movie');
const aiChatRoute = require('./routes/aiChat');

const app = express();

/* =========================
   RATE LIMITING (SECURITY)
========================= */
// ১. এআই চ্যাটবটের জন্য লিমিট (১ মিনিটে ৫টি মেসেজ)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  message: {
    success: false,
    reply: "আপনি খুব দ্রুত মেসেজ পাঠাচ্ছেন! দয়া করে এক মিনিট অপেক্ষা করুন। 🍿"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ২. সাধারণ মুভি এপিআই-এর জন্য লিমিট (১ মিনিটে ৩০টি রিকোয়েস্ট)
const movieLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "অতিরিক্ত রিকোয়েস্ট পাঠানো হয়েছে, একটু পর চেষ্টা করুন।"
  }
});

/* =========================
   CORS (PRODUCTION SAFE)
========================= */
const allowedOrigins = [
  'https://raatkibaat.in',
  'https://www.raatkibaat.in',
  'http://localhost:3000',
  'https://dc731d7b.app-preview.com' // হোস্টইঙ্গার প্রিভিউ লিঙ্ক
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.app-preview.com')) {
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
  .then(() => console.log('✅ MongoDB Connected with Rate Limiting'))
  .catch(err => console.error('❌ MongoDB Error:', err));

/* =========================
   ROUTES (Applied with Rate Limiters)
========================= */
app.use('/api/home', movieLimiter, homeRoutes);
app.use('/api/movies', movieLimiter, movieRoutes); 
app.use('/api/ai', chatLimiter, aiChatRoute);

/* =========================
   HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.send('🎬 Filmi Bharat Backend v3 (AI + Secure + Rate Limited)');
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Live', 
    security: 'Rate Limiting Active',
    message: 'Server is running perfectly!' 
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
