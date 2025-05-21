require('dotenv').config();
const express = require("express");
const app = express();
const connectDB = require('./db/connect_db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Import middlewares
const notFound = require("./middlewares/not_found");
const errorHandler = require("./middlewares/error_handler");

// Middleware to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let dbPromise = null;
if (process.env.MONGO_URI) {
  dbPromise = connectDB(process.env.MONGO_URI);
  dbPromise
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
}

// Middleware to ensure DB is connected before handling routes
const ensureDbConnected = async (req, res, next) => {
  if (!dbPromise) {
    return res.status(500).json({
      success: false,
      message: "Database connection not initialized"
    });
  }
  
  try {
    // Wait for DB connection before proceeding
    await dbPromise;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database"
    });
  }
};

// Root route - for health check (no DB required)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    endpoints: {
      auth: "/api/auth/*",
      users: "/api/users/*",
      api: "/api/*"
    }
  });
});

// Simple test route to verify DB connection
app.get('/api/dbtest', ensureDbConnected, (req, res) => {
  res.json({
    success: true,
    message: "Database connection successful"
  });
});

// Routes - ensure DB is connected before handling any DB-dependent routes
app.use('/api/auth', ensureDbConnected, authRoutes);
app.use('/api/users', ensureDbConnected, userRoutes);
app.use('/api', ensureDbConnected, apiRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// For local development
const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

// This is critical for Vercel
module.exports = app;