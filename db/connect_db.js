const mongoose = require("mongoose");

// Cache the database connection promise
let dbConnectionPromise = null;

const mongooseConnection = async (url) => {
  // If the connection is already being established, return the promise
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }

  // Set important mongoose options for serverless environments
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false, // Disable mongoose buffering
    serverSelectionTimeoutMS: 10000, // Give enough time to select a server
    socketTimeoutMS: 45000, // Longer timeout for operations
  };

  // Store the connection promise
  dbConnectionPromise = mongoose.connect(url, options);
  
  // Handle connection errors
  dbConnectionPromise.catch(err => {
    console.error('MongoDB connection error:', err);
    // Reset the promise so we can try again
    dbConnectionPromise = null;
  });
  
  return dbConnectionPromise;
};

module.exports = mongooseConnection;