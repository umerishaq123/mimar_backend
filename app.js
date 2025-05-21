// index.js - This must be in the root directory for Vercel
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

// Initialize DB connection early
if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connection initialized"))
    .catch(err => console.error("MongoDB initialization error:", err));
}

// Root route - for health check
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// For local development
const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// This is critical for Vercel
module.exports = app;