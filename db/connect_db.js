const mongoose = require('mongoose');

// Cache the connection promise to avoid multiple connections
let cachedConnection = null;

const connectDB = async (uri) => {
  // If we already have a cached connection, return it
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Create connection with optimized settings for serverless
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Wait up to 10 seconds
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 1, // Maintain at least 1 socket connection
      maxIdleTimeMS: 30000, // Close connections after 30 seconds
    });

    // Cache the connection
    cachedConnection = conn;
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Reset cached connection on error
    cachedConnection = null;
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
  cachedConnection = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
  cachedConnection = null;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (cachedConnection) {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed through app termination');
    process.exit(0);
  }
});

module.exports = connectDB;