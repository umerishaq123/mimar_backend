require('dotenv').config();
const express = require("express");
const app = express();
const connectDB = require('./db/connect_db');

// Import routes and middlewares
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');
const notFound = require("./middlewares/not_found");
const errorHandler = require("./middlewares/error_handler");

// Middleware to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection state
let dbConnected = false;

// Connect to DB and set up listeners
if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI)
    .then(() => {
      dbConnected = true;
      console.log("✅ MongoDB connected");
    })
    .catch(err => {
      console.error("❌ MongoDB connection error:", err);
      dbConnected = false;
    });
}

// Middleware to check DB connection
const checkDbConnection = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({
      success: false,
      message: "Service unavailable - Database not connected",
      retry: true
    });
  }
  next();
};

// Root route - no DB check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    database: dbConnected ? "connected" : "disconnected",
    endpoints: {
      auth: "/api/auth/*",
      users: "/api/users/*",
      api: "/api/*"
    }
  });
});

// Routes with DB connection check
app.use('/api/auth', checkDbConnection, authRoutes);
app.use('/api/users', checkDbConnection, userRoutes);
app.use('/api', checkDbConnection, apiRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server setup
const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

module.exports = app;