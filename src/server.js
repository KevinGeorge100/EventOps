// ─── EventOps Server ─────────────────────────────────────
// Main Express server with EJS templating for SSR
// ─────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Ensure Key Directories Exist ────────────────────────
// Prevent crashes if data or upload folders are missing
const DATA_DIR = path.join(__dirname, '..', 'data');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads', 'banners');

[DATA_DIR, UPLOAD_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ─── View Engine ─────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware ──────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration for admin authentication
app.use(session({
  secret: process.env.SESSION_SECRET || 'eventops-fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make session data available to all EJS templates
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session && req.session.isAuthenticated;
  next();
});

// ─── Routes ──────────────────────────────────────────────
const publicRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// ─── Health Check ────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'EventOps',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// ─── Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ─── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║   🚀 EventOps Server Running              ║
  ║   📡 http://localhost:${PORT}                ║
  ║   🔧 Mode: ${(process.env.NODE_ENV || 'development').padEnd(28)}║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
