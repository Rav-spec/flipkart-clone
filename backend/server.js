require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ─── CORS ────────────────────────────────────────────────────────────────────
// In production the frontend is served by this same Express server,
// so same-origin — CORS is not needed. Keep it open for safety.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Flipkart Clone API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);

// ─── Serve React Frontend in Production ─────────────────────────────────────
if (isProd) {
  const buildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(buildPath));
  // Send React's index.html for all non-API routes (React Router support)
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.use(notFound);
  app.use(errorHandler);
}

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛒  Flipkart Clone`);
  console.log(`🌐  http://localhost:${PORT}`);
  console.log(`📋  /api/health`);
  console.log(`🎨  Mode: ${isProd ? 'production (serving React build)' : 'development'}\n`);
});

module.exports = app;
