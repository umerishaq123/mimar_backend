require('dotenv').config(); // ✅ Always load env first

const express = require("express");
const app = express();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');

// DB connection and middlewares
const connectDB = require('./db/connect_db');
const notFound = require("./middlewares/not_found");
const errorHandler = require("./middlewares/error_handler");

// Middleware to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

// Start Server
const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in environment variables");
    }

    console.log("🟡 Connecting to MongoDB...");
    await connectDB(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(port, () =>
      console.log(`🚀 Server running on port ${port}...`)
    );
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
};

start();
