require('dotenv').config();
const express = require("express");
const app = express();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');

const connectDB = require('./db/connect_db');
const notFound = require("./middlewares/not_found");
const errorHandler = require("./middlewares/error_handler");

// Middleware to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection state
let isDbConnected = false;

// Middleware to ensure DB connection before each request
const ensureDbConnection = async (req, res, next) => {
  if (!isDbConnected) {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
      }
      console.log("🟡 Connecting to MongoDB...");
      await connectDB(process.env.MONGO_URI);
      isDbConnected = true;
      console.log("✅ MongoDB connected");
    } catch (error) {
      console.error("❌ Database connection error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Database connection failed"
      });
    }
  }
  next();
};

// Apply DB connection middleware to routes that need database
app.use('/api/auth', ensureDbConnection);
app.use('/api/users', ensureDbConnection);
app.use('/api', ensureDbConnection);

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

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

// For local development
const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in environment variables");
    }
    
    console.log("🟡 Connecting to MongoDB...");
    await connectDB(process.env.MONGO_URI);
    isDbConnected = true;
    console.log("✅ MongoDB connected");
    
    app.listen(port, () =>
      console.log(`🚀 Server running on port ${port}...`)
    );
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
};

// Export for Vercel
module.exports = app;

// Only start the server if not being imported (for local development)
if (require.main === module) {
  start();
}