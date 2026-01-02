require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/home');
const movieRoutes = require('./routes/movie');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://raatkibaat.in',
  'https://www.raatkibaat.in',
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Preflight (optional but helpful)
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/home', homeRoutes);
app.use('/api/movie', movieRoutes);

// Health check
app.get('/', (req, res) => res.send('Filmi Bharat Backend v2 ✅'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
