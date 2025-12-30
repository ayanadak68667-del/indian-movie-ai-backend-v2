require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/home');
const movieRoutes = require('./routes/movie');
const app = express();

// Middleware
app.use(cors({
  origin: ['*', 'http://localhost:3000']
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
app.get('/health', (req, res) => res.json({status: 'ok'}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
